import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';

import { ListItem, Box, Typography, ListItemButton } from '@mui/material';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import StrictModeDroppable from './common/StrictModeDroppable';

import boardApi from '../api/boardApi';
import type { RootState, AppDispatch } from '../redux/store';
import { setFavouritesBoards } from '../redux/features/boardSlice';

import type { Board } from '../utils/types';

function FavouriteList(): JSX.Element {
	const dispatch = useDispatch<AppDispatch>();
	const { boardId } = useParams();

	const boards = useSelector((state: RootState) => state.board.favourites);

	const [activeIndex, setActiveIndex] = useState(0);
	const [boardsData, setBoardsData] = useState<Board[]>([]);

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
		const getFavouriteBoards = async () => {
			try {
				const res = await boardApi.getAllFavourites();
				dispatch(setFavouritesBoards(res.data.boards));
				setBoardsData(res.data.boards);
			} catch (error) {
				// eslint-disable-next-line no-console
				console.log(error);
			}
		};

		getFavouriteBoards();
	}, [dispatch]);

	useEffect(() => {
		setBoardsData(boards);
	}, [boards]);

	useEffect(() => {
		const activeIdx = (boardsData ?? []).findIndex((i: Board) => i.id === boardId);
		setActiveIndex(activeIdx ?? 0);
	}, [boardId, boardsData]);

	const onDragEnd = async ({ source, destination }: { source: any, destination: any }): Promise<void> => {
		const tempList = [...(boardsData ?? [])];
		const [removed] = tempList.splice(source.index, 1);
		tempList.splice(destination.index, 0, removed);

		const newList = tempList.map((item, index) => ({
			...item,
			favoritePosition: tempList.length - index,
		}));

		const activeIdx = (boardsData ?? []).findIndex((i: Board) => i.id === boardId);
		setActiveIndex(activeIdx ?? 0);

		setBoardsData(newList);
		try {
			const res = await boardApi.updateFavouriteBoardsPosition(newList);
			dispatch(setFavouritesBoards(res.data.boards));
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.log(error);
		}
	};

	return (
		<>
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
						Favourites
					</Typography>
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
		</>
	);
}

export default FavouriteList;
