import React, { useState, useEffect, useRef } from 'react';

import { Box, Button, Typography, Divider, TextField, IconButton, Card } from '@mui/material';
import { AddOutlined, DeleteOutlined } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import StrictModeDroppable from './common/StrictModeDroppable';

import sectionApi from '../api/sectionApi';
import taskApi from '../api/taskApi';
import type { Section } from '../utils/types';

interface PropsType {
	sections: Section[]
	boardId: string | undefined
}

const TIME_OUT = 500;

function Kanban({ sections, boardId = '' }: PropsType): JSX.Element {
	const { enqueueSnackbar } = useSnackbar();
	const timer = useRef<number>();

	const [data, setData] = useState<Section[]>([]);

	useEffect(() => {
		setData(sections);
	}, [sections]);

	const createSection = async (): Promise<void> => {
		try {
			const res = await sectionApi.createSection(boardId);
			setData([...data, res.data.section]);
		} catch (error: any) {
			enqueueSnackbar(error.message, { variant: 'error' });
		}
	};

	const handleDeleteSection = async (sectionId: string): Promise<void> => {
		try {
			await sectionApi.deleteSection(boardId, sectionId);
			setData(data.filter((item) => item.id !== sectionId));
		} catch (error: any) {
			enqueueSnackbar(error.message, { variant: 'error' });
		}
	};

	const handleChangeTitle = async (sectionId: string, newTitle: string): Promise<void> => {
		clearTimeout(timer.current);
		const newData = data.map((section) => (section.id === sectionId ? { ...section, title: newTitle } : section));
		setData(newData);

		timer.current = window.setTimeout(() => {
			const changeTitle = async (): Promise<void> => {
				try {
					await sectionApi.updateSection(boardId, sectionId, { title: newTitle });
				} catch (error: any) {
					// eslint-disable-next-line no-console
					console.log(error);
				}
			};

			changeTitle();
		}, TIME_OUT);
	};

	const handleCreateTask = async (sectionId: string): Promise<void> => {
		try {
			const res = await taskApi.createTask(boardId, sectionId);

			const newData = data.map((item) => {
				if (item.id === sectionId) {
					const tasks = [res.data.task, ...(item.tasks ?? [])];
					return { ...item, tasks };
				}
				return item;
			});

			setData(newData);
		} catch (error: any) {
			enqueueSnackbar(error.message, { variant: 'error' });
		}
	};

	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	const onDragEnd = async ({ source, destination }: { source: any, destination: any }) => {
		if (!destination) return;

		const sourceColIndex = data.findIndex((i) => i.id === source.droppableId);
		const destinationColIndex = data.findIndex((i) => i.id === destination.droppableId);

		const sourceCol = data[sourceColIndex];
		const destinationCol = data[destinationColIndex];

		const sourceSectionId = sourceCol.id;
		const destinationSectionId = destinationCol.id;

		const sourceTasks = [...(sourceCol.tasks ?? [])];
		const destinationTasks = [...(destinationCol.tasks ?? [])];

		if (source.droppableId !== destination.droppableId) {
			const [removed] = sourceTasks.splice(source.index, 1);
			destinationTasks.splice(destination.index, 0, removed);
			data[sourceColIndex].tasks = sourceTasks;
			data[destinationColIndex].tasks = destinationTasks;
		} else {
			const [removed] = destinationTasks.splice(source.index, 1);
			destinationTasks.splice(destination.index, 0, removed);
			data[destinationColIndex].tasks = destinationTasks;
		}

		try {
			await taskApi.updateTaskPosition(boardId, {
				resourceList: sourceTasks,
				resourceSectionId: sourceSectionId,
				destinationList: destinationTasks,
				destinationSectionId,
			});
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.log(error);
		}
	};

	return (
		<>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
			>
				<Button onClick={() => { createSection(); }}>
					Add section
				</Button>
				<Typography variant="body2" fontWeight="700">
					{data.length}
					{' '}
					Section(s)
				</Typography>
			</Box>
			<Divider sx={{ margin: '10px 0' }} />
			<DragDropContext onDragEnd={(e) => { onDragEnd(e); }}>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'flex-start',
						width: 'calc(100vw - 400px)',
						overflowX: 'auto',
					}}
				>
					{
						data.map((section) => (
							<div key={section.id} style={{ width: '300px' }}>
								<StrictModeDroppable key={section.id} droppableId={section.id}>
									{
										(provided) => (
											<Box
												ref={provided.innerRef}
												{...provided.droppableProps}
												sx={{ width: '300px', padding: '10px', marginRight: '10px' }}
											>
												<Box
													sx={{
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'space-between',
														marginBottom: '10px',
													}}
												>
													<TextField
														value={section.title}
														onChange={(e) => { handleChangeTitle(section.id, e.target.value); }}
														placeholder="Untitled"
														variant="outlined"
														sx={{
															flexGrow: 1,
															'& .MuiOutlinedInput-input': { padding: 0 },
															'& .MuiOutlinedInput-notchedOutline': { border: 'unset' },
															'& .MuiOutlinedInput-root': { fontSize: '1rem', fontWeight: '700' },
														}}
													/>
													<IconButton
														size="small"
														sx={{
															color: 'gray',
															'&:hover': { color: 'green' },
														}}
														onClick={() => { handleCreateTask(section.id); }}
													>
														<AddOutlined />
													</IconButton>
													<IconButton
														size="small"
														sx={{
															color: 'gray',
															'&:hover': { color: 'red' },
														}}
														onClick={() => { handleDeleteSection(section.id); }}
													>
														<DeleteOutlined />
													</IconButton>
												</Box>
												{
													(section.tasks ?? []).map((task, index) => (
														<Draggable key={task.id} draggableId={task.id} index={index}>
															{
																// eslint-disable-next-line @typescript-eslint/no-shadow
																(provided, snapshot) => (
																	<Card
																		ref={provided.innerRef}
																		{...provided.draggableProps}
																		{...provided.dragHandleProps}
																		sx={{
																			padding: '10px',
																			marginBottom: '10px',
																			cursor: snapshot.isDragging ? 'grab' : 'pointer!important',
																		}}
																	>
																		<Typography>
																			{task.title === '' ? 'Untitled' : task.title}
																		</Typography>
																	</Card>
																)
															}
														</Draggable>
													))
												}
												{provided.placeholder}
											</Box>
										)
									}
								</StrictModeDroppable>
							</div>
						))
					}
				</Box>
			</DragDropContext>
		</>
	);
}

export default Kanban;
