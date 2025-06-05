import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/slices/userSlice';
import { RootState } from '../redux/store';
import SignInScreen from '../screens/Auth/SignInScreen';
import ProfilesListScreen from '../screens/Profiles/ProfilesListScreen';
import ProfileDetailScreen from '../screens/Profiles/ProfileDetailScreen';
import { USER_EMAIL_KEY, USER_TOKEN_KEY } from '../constants/storageKeys';

// Define the route types and any route params
export type RootStackParamList = {
    SignIn: undefined;
    ProfilesList: undefined;
    ProfileDetail: { id: string }; // ProfileDetail needs a user id
};

// Create the stack navigator using route types
const Stack = createNativeStackNavigator<RootStackParamList>();

// AppNavigator is the root navigation + login logic
export default function AppNavigator() {
    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn); // check login state
    const [isLoading, setIsLoading] = useState(true); // show nothing while checking AsyncStorage

    useEffect(() => {
        // Check if token/email is saved in local storage
        const checkLoginStatus = async () => {
            const token = await AsyncStorage.getItem(USER_TOKEN_KEY);
            const email = await AsyncStorage.getItem(USER_EMAIL_KEY);

            // If both token and email exist, dispatch login to Redux
            if (token && email) {
                dispatch(login({ token, email }));
            }
            setIsLoading(false);
        };

        checkLoginStatus();
    }, [dispatch]);

    // Don't render navigator until login check is complete
    if (isLoading) return null;

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {!isLoggedIn ? (
                    // If not logged in, show only SignIn screen
                    <Stack.Screen name="SignIn" component={SignInScreen} />
                ) : (
                    // If logged in, show list and detail screens
                    <>
                        <Stack.Screen name="ProfilesList" component={ProfilesListScreen} />
                        <Stack.Screen name="ProfileDetail" component={ProfileDetailScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
