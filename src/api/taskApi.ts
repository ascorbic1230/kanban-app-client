import axiosClient from './axiosClient';

import type { Task } from '../utils/types';

interface UpdateTaskType {
	title?: string
	content?: string
}

interface UpdateTaskPositionType {
	resourceList: Task[]
	resourceSectionId: string
	destinationList: Task[]
	destinationSectionId: string
}

const taskApi = {
	createTask: async (boardId: string, sectionId: string) => (
		axiosClient.post(`/boards/${boardId}/tasks`, { sectionId })
	),
	updateTask: async (boardId: string, taskId: string, params: UpdateTaskType) => (
		axiosClient.put(`/boards/${boardId}/tasks/${taskId}`, { ...params })
	),
	updateTaskPosition: async (boardId: string, params: UpdateTaskPositionType) => (
		axiosClient.put(`/boards/${boardId}/tasks/update-position`, { ...params })
	),
	deleteTask: async (boardId: string, taskId: string) => (
		axiosClient.delete(`/boards/${boardId}/tasks/${taskId}`)
	),
};

export default taskApi;
