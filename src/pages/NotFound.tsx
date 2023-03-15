import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';

export default function NotFound(): JSX.Element {
	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'column',
				minHeight: '100vh',
			}}
		>
			<Typography variant="h1" style={{ color: 'white' }}>
				404
			</Typography>
			<Typography variant="h6" style={{ color: 'white' }}>
				The page you’re looking for doesn’t exist.
			</Typography>
			<Button component={Link} to="/" variant="contained" sx={{ marginTop: 2 }}>Back Home</Button>
		</Box>
	);
}
