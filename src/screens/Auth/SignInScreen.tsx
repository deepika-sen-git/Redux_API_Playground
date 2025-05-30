import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { login } from '../../redux/slices/userSlice';
import { RootState } from '../../redux/store';

type Props = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

export default function SignInScreen({ navigation }: Props) {
    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    // useEffect(() => {
    //     const checkToken = async () => {
    //         const token = await AsyncStorage.getItem('token');
    //         const savedEmail = await AsyncStorage.getItem('email');
    //         if (token && savedEmail) {
    //             dispatch(login({ token, email: savedEmail }));
    //             navigation.navigate('ProfilesList');
    //         }
    //     };
    //     checkToken();
    // }, [dispatch, navigation]);

    const validateEmail = (email: string) => {
        // Simple email regex
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    const handleSignIn = async () => {
        if (!validateEmail(email)) {
            Alert.alert('Invalid Email', 'Please enter a valid email address.');
            return;
        }
        if (password.length < 6) {
            Alert.alert('Invalid Password', 'Password must be at least 6 characters long.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('https://reqres.in/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'reqres-free-v1',
                },
                body: JSON.stringify({ email, password }),
            });

            console.log(response);
            console.log('Payload:', { email, password });

            const data = await response.json();
            console.log(data);
            setLoading(false);

            if (response.ok && data.token) {
                // Save token and email
                console.log(data.token);
                await AsyncStorage.setItem('token', data.token);
                await AsyncStorage.setItem('email', email);
                console.log(data.token);

                dispatch(login({ token: data.token, email }));
                if (isLoggedIn) {
                    navigation.navigate('ProfilesList');
                }
            } else {
                console.log(data.token);
                Alert.alert('Login Failed', data.error || 'Unknown error occurred');
            }
        } catch (error) {
            setLoading(false);
            Alert.alert('Network Error', 'Please try again later.');
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Logging in...</Text>
            </View>
        );
    }

    if (isLoggedIn) {
        // Prevent rendering if already logged in, navigation will replace anyway
        return null;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign In</Text>

            <TextInput
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
            />

            <TextInput
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={styles.input}
            />

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
