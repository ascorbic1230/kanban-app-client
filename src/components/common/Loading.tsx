import React from 'react';
import { Box, CircularProgress } from '@mui/material';

interface PropsType {
	fullHeight: boolean
}

function Loading({ fullHeight }: PropsType): JSX.Element {
	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				width: '100%',
				height: fullHeight ? '100vh' : '100%',
			}}
		>
			<CircularProgress />
		</Box>
	);
}

export default Loading;
