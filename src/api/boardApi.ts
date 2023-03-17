import axiosClient from './axiosClient';

import type { Board } from '../utils/types';

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
	updateBoardsPosition: async (boards: Board[]) => (
		axiosClient.put('/boards', { boards })
	),
};

export default boardApi;
