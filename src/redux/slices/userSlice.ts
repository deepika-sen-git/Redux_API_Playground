import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define shape of the user state
interface UserState {
    isLoggedIn: boolean;
    token: string | null;
    email: string | null;
}

// Initial state of the user (not logged in)
const initialState: UserState = {
    isLoggedIn: false,
    token: null,
    email: null,
};

// Create the Redux slice for user
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // Handles login logic
        login(state, action: PayloadAction<{ token: string; email: string }>) {
            state.isLoggedIn = true;
            state.token = action.payload.token;
            state.email = action.payload.email;
        },
        // Handles logout logic
        logout(state) {
            state.isLoggedIn = false;
            state.token = null;
            state.email = null;
        },
    },
});

// Export actions to be used in components
export const { login, logout } = userSlice.actions;

// Export reducer to be added in store
export default userSlice.reducer;
