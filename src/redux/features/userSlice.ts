import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { type User } from '../../utils/types';

export interface UserState {
	value: User | null
}

const initialState: UserState = { value: null };

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser: (state, action: PayloadAction<User>) => {
			// eslint-disable-next-line no-param-reassign
			state.value = action.payload;
		},
	},
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
