/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import boardApi from '../../api/boardApi';
import { type Board } from '../../utils/types';

export interface BoardState {
	all: Board[]
	current: Board | null
}

const initialState: BoardState = { all: [], current: null };

export const fetchAllBoards = createAsyncThunk(
	'board/getAll',
	async () => {
		const res = await boardApi.getAll();

		return res.data.boards;
	},
);

export const boardSlice = createSlice({
	name: 'board',
	initialState,
	reducers: {
		setBoards: (state, action: PayloadAction<Board[]>) => {
			state.all = action.payload;
		},
		setCurrentBoard: (state, action: PayloadAction<Board>) => {
			state.current = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(fetchAllBoards.fulfilled, (state, action) => {
			state.all = action.payload;
		});
	},
});

export const { setBoards, setCurrentBoard } = boardSlice.actions;

export default boardSlice.reducer;
