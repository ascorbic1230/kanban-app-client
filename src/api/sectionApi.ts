import axiosClient from './axiosClient';

interface UpdateSectionType {
	title?: string
}

const sectionApi = {
	createSection: async (boardId: string) => (
		axiosClient.post(`/boards/${boardId}/sections`)
	),
	updateSection: async (boardId: string, sectionId: string, params: UpdateSectionType) => (
		axiosClient.put(`/boards/${boardId}/sections/${sectionId}`, {
			title: params.title,
		})
	),
	deleteSection: async (boardId: string, sectionId: string) => (
		axiosClient.delete(`/boards/${boardId}/sections/${sectionId}`)
	),
};

export default sectionApi;
