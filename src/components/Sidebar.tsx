import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Drawer, List, ListItemButton, Box, Typography, IconButton } from '@mui/material';
import { LogoutOutlined } from '@mui/icons-material';

import type { RootState } from '../redux/store';
import assets from '../assets';

function Sidebar(): JSX.Element {
	const navigate = useNavigate();

	const user = useSelector((state: RootState) => state.user.value);

	const sidebarWidth = 250;

	const handleLogout = (): void => {
		localStorage.removeItem('token');
		navigate('/login');
	};

	return (
		<Drawer
			container={window.document.body}
			variant="permanent"
			open
			sx={{
				width: sidebarWidth,
				height: '100vh',
				'& > div': { borderRight: 'none' },
			}}
		>
			<List
				disablePadding
				sx={{
					width: sidebarWidth,
					height: '100vh',
					backgroundColor: assets.colors.secondary,
				}}
			>
				<ListItemButton>
					<Box
						sx={{
							width: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
						}}
					>
						<Typography variant="body2" fontWeight="700">
							{user?.username ?? ''}
						</Typography>
						<IconButton onClick={handleLogout}>
							<LogoutOutlined fontSize="small" />
						</IconButton>
					</Box>
				</ListItemButton>
			</List>
		</Drawer>
	);
}

export default Sidebar;
