import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { Container, Box } from '@mui/material';
import Loading from '../components/common/Loading';

import authUtils from '../utils/authUtils';

import assets from '../assets';

function AuthLayout(): JSX.Element {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
		const checkAuth = async () => {
			const isAuth = await authUtils.isAuthenticated();

			if (!isAuth) {
				setLoading(false);
			} else {
				navigate('/');
			}
		};

		checkAuth();
	}, [navigate]);

	return (
		loading
			? (
				<Loading fullHeight />
			)
			: (
				<Container component="main" maxWidth="xs">
					<Box
						sx={{
							marginTop: 8,
							display: 'flex',
							alignItems: 'center',
							flexDirection: 'column',
						}}
					>
						<img src={assets.images.logoDark} style={{ width: '100px' }} alt="app logo" />
						<Outlet />
					</Box>
				</Container>
			)
	);
}

export default AuthLayout;
