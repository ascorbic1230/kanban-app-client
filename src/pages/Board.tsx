import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Box, IconButton, TextField, Button, Typography, Divider } from '@mui/material';
import { StarOutlined, StarBorderOutlined, DeleteOutlined } from '@mui/icons-material';
import EmojiPicker from '../components/common/EmojiPicker';

import boardApi from '../api/boardApi';
import { fetchAllBoards } from '../redux/features/boardSlice';

import type { AppDispatch, RootState } from '../redux/store';
import type { Section } from '../utils/types';

function Board(): JSX.Element {
	const { boardId } = useParams();
	const dispatch = useDispatch<AppDispatch>();

	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [sections, setSections] = useState<Section[]>([]);
	const [isFavourite, setIsFavourite] = useState(false);
	const [icon, setIcon] = useState('');

	const boards = useSelector((state: RootState) => state.board.all);

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
		const getBoard = async () => {
			try {
				const { data } = await boardApi.getOne(boardId ?? '');
				setTitle(data.board.title);
				setDescription(data.board.description);
				setSections(data.board.sections);
				setIsFavourite(data.board.favourite);
				setIcon(data.board.icon);
			} catch (error) {
				// eslint-disable-next-line no-console
				console.log(error);
			}
		};

		getBoard();
	}, [boardId]);

	const handleChangeIcon = async (newIcon: string): Promise<void> => {
		setIcon(newIcon);

		try {
			await boardApi.updateBoard({ boardId: boardId ?? '', icon: newIcon });
			dispatch(fetchAllBoards());
		} catch (error) {
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
					width: '100%',
				}}
			>
				<IconButton>
					{
						isFavourite
							? <StarOutlined color="warning" />
							: <StarBorderOutlined />
					}
				</IconButton>
				<IconButton color="error">
					<DeleteOutlined />
				</IconButton>
			</Box>
			<Box sx={{ padding: '10px 50px' }}>
				<Box>
					<EmojiPicker icon={icon} onChangeIcon={(newIcon: string) => { handleChangeIcon(newIcon); }} />
					<TextField
						value={title}
						placeholder="Untitled"
						variant="outlined"
						fullWidth
						sx={{
							'& .MuiOutlinedInput-input': { padding: 0 },
							'& .MuiOutlinedInput-notchedOutline': { border: 'unset' },
							'& .MuiOutlineInput-root': { fontSize: '2rem', fontWeight: '700' },
						}}
					/>
					<TextField
						value={description}
						placeholder="Untitled"
						variant="outlined"
						fullWidth
						multiline
						sx={{
							'& .MuiOutlinedInput-input': { padding: 0 },
							'& .MuiOutlinedInput-notchedOutline': { border: 'unset' },
							'& .MuiOutlineInput-root': { fontSize: '0.8rem' },
						}}
					/>
				</Box>
				<Box>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
						}}
					>
						<Button>
							Add section
						</Button>
						<Typography variant="body2" fontWeight="700">
							{sections.length}
							{' '}
							Section(s)
						</Typography>
					</Box>
					<Divider sx={{ margin: '10px 0' }} />
				</Box>
			</Box>
		</>
	);
}

export default Board;
