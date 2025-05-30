import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    isLoggedIn: boolean;
    token: string | null;
    email: string | null;
}

const initialState: UserState = {
    isLoggedIn: false,
    token: null,
    email: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login(state, action: PayloadAction<{ token: string; email: string }>) {
            state.isLoggedIn = true;
            state.token = action.payload.token;
            state.email = action.payload.email;
        },
        logout(state) {
            state.isLoggedIn = false;
            state.token = null;
            state.email = null;
        },
    },
});
export const { login, logout } = userSlice.actions;
export default userSlice.reducer;