import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { Box } from '@mui/material';
import Loading from '../components/common/Loading';
import Sidebar from '../components/Sidebar';

import { setUser } from '../redux/features/userSlice';
import authUtils from '../utils/authUtils';

function AppLayout(): JSX.Element {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
		const checkAuth = async () => {
			const user = await authUtils.isAuthenticated();

			if (!user) {
				navigate('/login');
			} else {
				dispatch(setUser(user));
				setLoading(false);
			}
		};

		checkAuth();
	}, [dispatch, navigate]);

	return (
		loading
			? (
				<Loading fullHeight />
			)
			: (
				<Box sx={{ display: 'flex' }}>
					<Sidebar />
					<Box
						sx={{
							flexGrow: 1,
							p: 1,
							width: 'max-content',
						}}
					>
						<Outlet />
					</Box>
				</Box>
			)
	);
}

export default AppLayout;
