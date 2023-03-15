import React from 'react';
import { Outlet } from 'react-router-dom';

function AppLayout(): JSX.Element {
	return (
		<Outlet />
	);
}

export default AppLayout;
