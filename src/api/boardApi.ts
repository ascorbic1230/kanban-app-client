import axiosClient from './axiosClient';

import type { Board } from '../utils/types';

interface UpdateBoardType {
	boardId: string
	title?: string
	description?: string
	favourite?: boolean
	icon?: string
}

const boardApi = {
	createBoard: async () => (
		axiosClient.post('/boards')
	),
	getOne: async (boardId: string) => (
		axiosClient.get(`/boards/${boardId}`)
	),
	getAll: async () => (
		axiosClient.get('/boards')
	),
	getAllFavourites: async () => (
		axiosClient.get('/boards/favourites')
	),
	updateBoardsPosition: async (boards: Board[]) => (
		axiosClient.put('/boards', { boards })
	),
	updateFavouriteBoardsPosition: async (boards: Board[]) => (
		axiosClient.put('/boards/favourites', { boards })
	),
	updateBoard: async (params: UpdateBoardType) => (
		axiosClient.put(`/boards/${params.boardId}`, {
			title: params.title,
			description: params.description,
			favourite: params.favourite,
			icon: params.icon,
		})
	),
};

export default boardApi;
