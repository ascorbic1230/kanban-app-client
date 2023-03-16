import axios from 'axios';
import queryString from 'query-string';

const backendBaseUrl = process.env.REACT_APP_BACKEND_BASE_URL;
const getToken = (): string | null => localStorage.getItem('token');

const axiosClient = axios.create({
	baseURL: backendBaseUrl,
	paramsSerializer: {
		serialize: (params) => queryString.stringify({ params }),
	},
});

axiosClient.interceptors.request.use((cf): any => {
	const token = getToken();

	return {
		...cf,
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token === null ? '' : token}`,
		},
	};
});

axiosClient.interceptors.response.use(
	(response) => (
		response?.data ? response.data : response
	),
	async (error) => {
		if (error.response) {
			return Promise.reject(error.response.data);
		}

		if (error.request) {
			return Promise.reject(error.request);
		}

		return Promise.reject(error.message);
	},
);

export default axiosClient;
