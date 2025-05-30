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


export type RootStackParamList = {
    SignIn: undefined;
    ProfilesList: undefined;
    ProfileDetail: { id: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkLoginStatus = async () => {
            const token = await AsyncStorage.getItem('userToken');
            const email = await AsyncStorage.getItem('email');
            if (token && email) {
                dispatch(login({ token, email }));
            }
            setIsLoading(false);
        };
        checkLoginStatus();
    });

    if (isLoading) return null; // or a splash screen

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {!isLoggedIn ? (
                    <Stack.Screen name="SignIn" component={SignInScreen} />
                ) : (
                    <>
                        <Stack.Screen name="ProfilesList" component={ProfilesListScreen} />
                        <Stack.Screen name="ProfileDetail" component={ProfileDetailScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
