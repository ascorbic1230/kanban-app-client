import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import { Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import boardApi from '../api/boardApi';
import { setCurrentBoard, fetchAllBoards } from '../redux/features/boardSlice';

import type { AppDispatch } from '../redux/store';

function Home(): JSX.Element {
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();

	const [loading, setLoading] = useState(false);

	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	const createBoard = async () => {
		setLoading(true);
		try {
			const res = await boardApi.createBoard();
			dispatch(setCurrentBoard(res.data.board));
			dispatch(fetchAllBoards());
			navigate(`/boards/${res.data.board.id}`);
		} catch (error: any) {
			enqueueSnackbar(error.message, { variant: 'error' });
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box
			sx={{
				height: '100%',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<LoadingButton
				variant="outlined"
				color="success"
				onClick={() => { createBoard(); }}
				loading={loading}
			>
				Click here to create your first board
			</LoadingButton>
		</Box>
	);
}

export default Home;
