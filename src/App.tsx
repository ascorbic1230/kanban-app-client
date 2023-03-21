import React from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './styles/custom-scrollbar.css';
import { CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import AuthLayout from './layout/AuthLayout';
import AppLayout from './layout/AppLayout';

import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import Board from './pages/Board';
import NotFound from './pages/NotFound';

const router = createBrowserRouter([
	{
		element: <AppLayout />,
		errorElement: <NotFound />,
		children: [
			{
				path: '/',
				element: <Home />,
			},
			{
				path: '/boards',
				element: <Home />,
			},
			{
				path: '/boards/:boardId',
				element: <Board />,
			},
		],
	},
	{
		element: <AuthLayout />,
		children: [
			{
				path: '/signup',
				element: <Signup />,
			},
			{
				path: '/login',
				element: <Login />,
			},
		],
	},
]);

function App(): JSX.Element {
	const theme = createTheme({
		palette: { mode: 'dark' },
	});

	return (
		<ThemeProvider theme={theme}>
			<SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} preventDuplicate>
				<CssBaseline />
				<RouterProvider router={router} />
			</SnackbarProvider>
		</ThemeProvider>
	);
}

export default App;
