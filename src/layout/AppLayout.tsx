import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { Box } from '@mui/material';
import Loading from '../components/common/Loading';
import Sidebar from '../components/Sidebar';

import authUtils from '../utils/authUtils';

function AppLayout(): JSX.Element {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
		const checkAuth = async () => {
			const user = await authUtils.isAuthenticated();

			if (!user) {
				navigate('/login');
			} else {
				// TODO: save user info
				setLoading(false);
			}
		};

		checkAuth();
	}, []);

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
