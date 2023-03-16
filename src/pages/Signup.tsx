import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Box, Button, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import authApi from '../api/authApi';
import { type ServerValidateErrorType } from '../utils/types';

function Signup(): JSX.Element {
	const navigate = useNavigate();

	const [loading, setLoading] = useState(false);
	const [usernameErrText, setUsernameErrText] = useState('');
	const [passwordErrText, setPasswordErrText] = useState('');
	const [confirmPasswordErrText, setConfirmPasswordErrText] = useState('');

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault();
		setUsernameErrText('');
		setPasswordErrText('');
		setConfirmPasswordErrText('');

		const data = new FormData(e.currentTarget);
		const username = (data.get('username') as string).trim();
		const password = (data.get('password') as string).trim();
		const confirmPassword = (data.get('confirmPassword') as string).trim();

		setLoading(true);

		try {
			const res = await authApi.signup({ username, password, confirmPassword });

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
						case 'confirmPassword': {
							setConfirmPasswordErrText(i.msg);
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
				<TextField
					margin="normal"
					required
					fullWidth
					id="confirmPassword"
					label="Confirm Password"
					name="confirmPassword"
					type="password"
					disabled={loading}
					error={confirmPasswordErrText !== ''}
					helperText={confirmPasswordErrText}
				/>
				<LoadingButton
					sx={{ mt: 3, mb: 2 }}
					variant="outlined"
					fullWidth
					color="success"
					type="submit"
					loading={loading}
				>
					Sign up
				</LoadingButton>
			</Box>
			<Button
				component={Link}
				to="/login"
				sx={{ textTransform: 'none' }}
			>
				Already have an account? Login
			</Button>
		</>
	);
}

export default Signup;
