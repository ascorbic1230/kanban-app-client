import axiosClient from './axiosClient';

interface SignupParams {
	username: string
	password: string
	confirmPassword: string
}

interface LoginParams {
	username: string
	password: string
}

const authApi = {
	signup: async (params: SignupParams) => (
		axiosClient.post('auth/signup', params)
	),
	login: async (params: LoginParams) => (
		axiosClient.post('auth/login', params)
	),
	verifyToken: async () => (
		axiosClient.post('auth/verify-token')
	),
};

export default authApi;
