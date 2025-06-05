// redux/thunks/loginUser.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '../slices/userSlice';
import { USER_EMAIL_KEY, USER_TOKEN_KEY } from '../../constants/storageKeys';

export const loginUser = createAsyncThunk(
    'user/loginUser',
    async ({ email, password }: { email: string; password: string }, { dispatch, rejectWithValue }) => {
        try {
            const response = await fetch('https://reqres.in/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'reqres-free-v1',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok && data.token) {
                await AsyncStorage.setItem(USER_TOKEN_KEY, data.token);
                await AsyncStorage.setItem(USER_EMAIL_KEY, email);
                dispatch(login({ token: data.token, email }));
                return data;
            } else {
                return rejectWithValue(data.error || 'Unknown error occurred');
            }
        } catch (error) {
            return rejectWithValue('Network Error');
        }
    }
);
