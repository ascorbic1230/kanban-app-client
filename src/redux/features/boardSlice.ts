/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import boardApi from '../../api/boardApi';
import { type Board } from '../../utils/types';

export interface BoardState {
	all: Board[]
	favourites: Board[]
	current: Board | null
}

const initialState: BoardState = {
	all: [],
	favourites: [],
	current: null,
};

export const fetchAllBoards = createAsyncThunk(
	'board/getAll',
	async () => {
		const res = await boardApi.getAll();

		return res.data.boards;
	},
);

export const fetchAllFavouriteBoards = createAsyncThunk(
	'board/getAllFavourite',
	async () => {
		const res = await boardApi.getAllFavourites();

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
		setFavouritesBoards: (state, action: PayloadAction<Board[]>) => {
			state.favourites = action.payload;
		},
		setCurrentBoard: (state, action: PayloadAction<Board>) => {
			state.current = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchAllBoards.fulfilled, (state, action) => {
				state.all = action.payload;
			})
			.addCase(fetchAllFavouriteBoards.fulfilled, (state, action) => {
				state.favourites = action.payload;
			});
	},
});

export const { setBoards, setFavouritesBoards, setCurrentBoard } = boardSlice.actions;

export default boardSlice.reducer;
