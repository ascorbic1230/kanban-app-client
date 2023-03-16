import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Box, Button, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { type ServerValidateErrorType } from '../utils/types';
import authApi from '../api/authApi';

function Login(): JSX.Element {
	const navigate = useNavigate();

	const [loading, setLoading] = useState(false);
	const [usernameErrText, setUsernameErrText] = useState('');
	const [passwordErrText, setPasswordErrText] = useState('');

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault();
		setUsernameErrText('');
		setPasswordErrText('');

		const formData = new FormData(e.currentTarget);
		const username = (formData.get('username') as string).trim();
		const password = (formData.get('password') as string).trim();

		setLoading(true);

		try {
			const res = await authApi.login({ username, password });

			localStorage.setItem('token', res.data.token);
			navigate('/');
		} catch (error: any) {
			if (error?.data?.errors) {
				const errors = error.data.errors as ServerValidateErrorType[];
				errors.forEach((i) => {
					switch (i.param) {
						case 'username': {
							setUsernameErrText(i.msg);
							break;
						}
						case 'password': {
							setPasswordErrText(i.msg);
							break;
						}
						default: {
							break;
						}
					}
				});
			}
		}

		setLoading(false);
	};

	return (
		<>
			<Box
				component="form"
				sx={{ mt: 1 }}
				onSubmit={(e) => { handleSubmit(e); }}
				noValidate
			>
				<TextField
					margin="normal"
					required
					fullWidth
					id="username"
					label="Username"
					name="username"
					disabled={loading}
					error={usernameErrText !== ''}
					helperText={usernameErrText}
				/>
				<TextField
					margin="normal"
					required
					fullWidth
					id="password"
					label="Password"
					name="password"
					type="password"
					disabled={loading}
					error={passwordErrText !== ''}
					helperText={passwordErrText}
				/>
				<LoadingButton
					sx={{ mt: 3, mb: 2 }}
					variant="outlined"
					fullWidth
					color="success"
					type="submit"
					loading={loading}
				>
					Login
				</LoadingButton>
			</Box>
			<Button
				component={Link}
				to="/signup"
				sx={{ textTransform: 'none' }}
			>
				Don&apos;t have an account? Signup
			</Button>
		</>
	);
}

export default Login;
