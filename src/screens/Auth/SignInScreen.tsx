// SignInScreen: Handles user sign-in with email & password, integrates with Redux & AsyncStorage for persistence

import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { login } from '../../redux/slices/userSlice';
import { RootState } from '../../redux/store';
import { USER_EMAIL_KEY, USER_TOKEN_KEY } from '../../constants/storageKeys';

type Props = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

export default function SignInScreen({ navigation }: Props) {
    const dispatch = useDispatch();

    // Access Redux state to check if user is logged in
    const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

    // Local state to store user inputs and loading state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Simple email validation using regex
    const validateEmail = (email: string) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    // Handler to perform sign-in
    const handleSignIn = async () => {
        // Validate email format
        if (!validateEmail(email)) {
            Alert.alert('Invalid Email', 'Please enter a valid email address.');
            return;
        }

        // Password length validation
        if (password.length < 6) {
            Alert.alert('Invalid Password', 'Password must be at least 6 characters long.');
            return;
        }

        setLoading(true);

        try {
            // Send POST request to API with email and password
            const response = await fetch('https://reqres.in/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'reqres-free-v1',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            setLoading(false);

            if (response.ok && data.token) {
                // Save token & email in AsyncStorage for persistence
                await AsyncStorage.setItem(USER_TOKEN_KEY, data.token);
                await AsyncStorage.setItem(USER_EMAIL_KEY, email);

                // Update Redux store with login info
                dispatch(login({ token: data.token, email }));

                // Navigate to ProfilesList screen after successful login
                if (isLoggedIn) {
                    navigation.navigate('ProfilesList');
                }
            } else {
                // Show error if login failed
                Alert.alert('Login Failed', data.error || 'Unknown error occurred');
            }
        }
        catch (error) {
            setLoading(false);
            Alert.alert('Network Error', 'Please try again later.');
        }
    };

    // Show loading indicator while login request is in progress
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Logging in...</Text>
            </View>
        );
    }

    // If already logged in, don't render login form again
    if (isLoggedIn) {
        return null;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign In</Text>

            {/* Email input */}
            <TextInput
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
            />

            {/* Password input */}
            <TextInput
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={styles.input}
            />

            {/* Sign In button */}
            <Button title="Sign In" onPress={handleSignIn} />
        </View>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        marginBottom: 20,
        borderRadius: 5,
    },
});
