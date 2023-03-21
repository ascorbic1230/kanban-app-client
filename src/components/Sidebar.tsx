import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import { Drawer, List, ListItem, Box, Typography, IconButton, ListItemButton } from '@mui/material';
import { LogoutOutlined, AddBoxOutlined } from '@mui/icons-material';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import FavouriteList from './FavouriteList';
import StrictModeDroppable from './common/StrictModeDroppable';

import boardApi from '../api/boardApi';
import type { RootState, AppDispatch } from '../redux/store';
import { setBoards } from '../redux/features/boardSlice';

import type { Board } from '../utils/types';
import assets from '../assets';

function Sidebar(): JSX.Element {
	const navigate = useNavigate();
	const dispatch = useDispatch<AppDispatch>();
	const { boardId } = useParams();
	const { enqueueSnackbar } = useSnackbar();

	const user = useSelector((state: RootState) => state.user.value);
	const boards = useSelector((state: RootState) => state.board.all);

	const [activeIndex, setActiveIndex] = useState(0);
	const [boardsData, setBoardsData] = useState<Board[]>([]);

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
		const getBoards = async () => {
			try {
				const res = await boardApi.getAll();
				dispatch(setBoards(res.data.boards));
				setBoardsData(res.data.boards);
			} catch (error: any) {
				enqueueSnackbar(error?.message, { variant: 'error' });
			}
		};

		getBoards();
	}, [dispatch, enqueueSnackbar]);

	useEffect(() => {
		setBoardsData(boards);
	}, [boards]);

	useEffect(() => {
		if (boards && boards.length > 0 && boardId === undefined) {
			navigate(`/boards/${boards[0].id}`);
		}
	}, [boards, boardId, navigate]);

	useEffect(() => {
		const activeIdx = (boardsData ?? []).findIndex((i: Board) => i.id === boardId);
		setActiveIndex(activeIdx ?? 0);
	}, [boardId, boardsData]);

	const handleLogout = (): void => {
		localStorage.removeItem('token');
		navigate('/login');
	};

	const addBoard = async (): Promise<void> => {
		try {
			const res = await boardApi.createBoard();
			const newList = [res.data.board, ...boardsData];
			dispatch(setBoards(newList));
			setBoardsData(newList);
			navigate(`/boards/${res.data.board.id}`);
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.log(error);
		}
	};

	const onDragEnd = async ({ source, destination }: { source: any, destination: any }): Promise<void> => {
		const tempList = [...(boardsData ?? [])];
		const [removed] = tempList.splice(source.index, 1);
		tempList.splice(destination.index, 0, removed);

		const newList = tempList.map((item, index) => ({
			...item,
			position: tempList.length - index,
		}));

		const activeIdx = (boardsData ?? []).findIndex((i: Board) => i.id === boardId);
		setActiveIndex(activeIdx ?? 0);

		setBoardsData(newList);
		try {
			const res = await boardApi.updateBoardsPosition(newList);
			dispatch(setBoards(res.data.boards));
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.log(error);
		}
	};

	const sidebarWidth = 250;

	return (
		<Drawer
			container={window.document.body}
			variant="permanent"
			open
			sx={{
				width: sidebarWidth,
				height: '100vh',
				'& > div': { borderRight: 'none' },
			}}
		>
			<List
				disablePadding
				sx={{
					width: sidebarWidth,
					height: '100vh',
					backgroundColor: assets.colors.secondary,
				}}
			>
				<ListItem>
					<Box
						sx={{
							width: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
						}}
					>
						<Typography variant="body2" fontWeight="700">
							{user?.username ?? ''}
						</Typography>
						<IconButton onClick={handleLogout}>
							<LogoutOutlined fontSize="small" />
						</IconButton>
					</Box>
				</ListItem>
				<FavouriteList />
				<ListItem sx={{ marginTop: '10px' }}>
					<Box
						sx={{
							width: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
						}}
					>
						<Typography variant="body2" fontWeight="700">
							Private
						</Typography>
						<IconButton onClick={() => { addBoard(); }}>
							<AddBoxOutlined fontSize="small" />
						</IconButton>
					</Box>
				</ListItem>
				<DragDropContext onDragEnd={(e) => { onDragEnd(e); }}>
					<StrictModeDroppable key="list-board-droppable" droppableId="list-board-droppable">
						{
							(provided) => (
								<div ref={provided.innerRef} {...provided.droppableProps}>
									{
										(boardsData ?? []).map((item, index) => (
											<Draggable key={item.id} draggableId={item.id} index={index}>
												{
													(_provided, snapshot) => (
														<ListItemButton
															ref={_provided.innerRef}
															{..._provided.dragHandleProps}
															{..._provided.draggableProps}
															selected={index === activeIndex}
															component={Link}
															to={`/boards/${item.id}`}
															sx={{
																pl: '20px',
																cursor: snapshot.isDragging ? 'grab' : 'pointer!important',
															}}
														>
															<Typography
																variant="body2"
																fontWeight="700"
																sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
															>
																{item.icon}
																{' '}
																{item.title}
															</Typography>
														</ListItemButton>
													)
												}
											</Draggable>
										))
									}
									{provided.placeholder}
								</div>
							)
						}
					</StrictModeDroppable>
				</DragDropContext>
			</List>
		</Drawer>
	);
}

export default Sidebar;
