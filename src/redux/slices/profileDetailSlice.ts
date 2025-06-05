// src/store/profileDetailSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface Location {
    street: string;
    city: string;
    state: string;
    country: string;
    timezone: string;
}

interface UserDetail {
    id: string;
    title: string;
    firstName: string;
    lastName: string;
    gender: string;
    email: string;
    dateOfBirth: string;
    phone: string;
    picture: string;
    location: Location;
}

interface DetailState {
    user: UserDetail | null;
    loading: boolean;
    error: string | null;
}

const initialState: DetailState = {
    user: null,
    loading: false,
    error: null,
};

export const fetchUserDetail = createAsyncThunk(
    'profileDetail/fetchUserDetail',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`https://dummyapi.io/data/v1/user/${id}`, {
                headers: { 'app-id': '6149ac924e29ce2338d6f836' }, // or use constant
            });
            const data = await response.json();
            return data;
        } catch (err) {
            return rejectWithValue('Failed to fetch user details');
        }
    }
);

const profileDetailSlice = createSlice({
    name: 'profileDetail',
    initialState,
    reducers: {
        clearUserDetail: (state) => {
            state.user = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(fetchUserDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearUserDetail } = profileDetailSlice.actions;
export default profileDetailSlice.reducer;
