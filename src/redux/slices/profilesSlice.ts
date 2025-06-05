import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

interface User {
    id: string;
    title: string;
    firstName: string;
    lastName: string;
    picture: string;
}

interface ProfilesState {
    users: User[];
    loading: boolean;
    error: string | null;
    page: number;
    hasMore: boolean;
}

const initialState: ProfilesState = {
    users: [],
    loading: false,
    error: null,
    page: 0,
    hasMore: true,
};

const API_URL = 'https://dummyapi.io/data/v1/user?limit=10';
const APP_ID = '6149ac924e29ce2338d6f836';

export const fetchProfiles = createAsyncThunk(
    'profiles/fetchProfiles',
    async (page: number, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${API_URL}&page=${page}`, {
                headers: { 'app-id': APP_ID },
            });
            return res.data.data as User[];
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const profilesSlice = createSlice({
    name: 'profiles',
    initialState,
    reducers: {
        resetProfiles: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfiles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProfiles.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.length > 0) {
                    state.users.push(...action.payload);
                    state.page += 1;
                } else {
                    state.hasMore = false;
                }
            })
            .addCase(fetchProfiles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { resetProfiles } = profilesSlice.actions;
export default profilesSlice.reducer;
