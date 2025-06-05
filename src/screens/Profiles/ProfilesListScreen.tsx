// ProfilesListScreen: Displays a paginated list of user profiles with logout option and navigation to details

import React, { useEffect, useLayoutEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { DUMMY_API_KEY } from '../../constants/api';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfileCard from '../../components/ProfileCard';
import { LIMIT, USER_TOKEN_KEY } from '../../constants/storageKeys';

type Props = NativeStackScreenProps<RootStackParamList, 'ProfilesList'>;

interface User {
    id: string;
    title: string;
    firstName: string;
    lastName: string;
    picture: string;
}

export default function ProfilesListScreen({ navigation }: Props) {
    const [users, setUsers] = useState<User[]>([]); // List of loaded users
    const [page, setPage] = useState(0);           // Current page number for pagination
    const [loading, setLoading] = useState(false); // Loading indicator for API requests
    const [total, setTotal] = useState(0);         // Total number of users available

    const dispatch = useDispatch();

    // Logout confirmation & handler
    const logoutHandler = useCallback(() => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        // Clear stored token and email, then update Redux state
                        await AsyncStorage.removeItem(USER_TOKEN_KEY);
                        await AsyncStorage.removeItem('email');
                        dispatch(logout());
                    },
                },
            ],
            { cancelable: true }
        );
    }, [dispatch]);

    // Add Logout button to header right
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={logoutHandler} style={styles.logoutButton}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation, logoutHandler]);

    // Fetch users from API whenever page changes
    useEffect(() => {
        const fetchUsers = async () => {
            if (loading) return;               // Prevent duplicate calls
            if (total !== 0 && users.length >= total) return; // No more users to load

            setLoading(true);

            try {
                const response = await fetch(
                    `https://dummyapi.io/data/v1/user?limit=${LIMIT}&page=${page}`,
                    {
                        headers: { 'app-id': DUMMY_API_KEY },
                    }
                );
                const data = await response.json();

                // Filter out any duplicate users that are already loaded
                const newUsers = data.data.filter(
                    (newUser: User) => !users.some(user => user.id === newUser.id)
                );

                // Append new users to existing list
                setUsers(prev => [...prev, ...newUsers]);

                // Update total users count from API response
                setTotal(data.total);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [page]);

    // Navigate to ProfileDetail screen when user taps a profile
    const handlePress = useCallback(
        (id: string) => {
            navigation.navigate('ProfileDetail', { id });
        },
        [navigation]
    );

    // Render each profile card
    const renderItem = useCallback(
        ({ item }: { item: User }) => (
            <ProfileCard
                image={item.picture}
                name={`${item.title} ${item.firstName} ${item.lastName}`}
                onPress={() => handlePress(item.id)}
            />
        ),
        [handlePress]
    );

    // Load next page when list end is reached
    const loadMore = useCallback(() => {
        if (!loading && users.length < total) {
            setPage(prev => prev + 1);
        }
    }, [loading, users.length, total]);

    // Optimize FlatList performance by pre-calculating item layout
    const getItemLayout = useCallback(
        (_data: User[] | null | undefined, index: number) => ({
            length: 220,       // Height of each item
            offset: 180 * index, // Offset from top
            index,
        }),
        []
    );

    // Show spinner in footer while loading more users
    const renderFooter = () => {
        if (!loading) return null;
        return (
            <View style={styles.footer}>
                <ActivityIndicator size="small" color="#0000ff" />
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profiles</Text>

            {/* Profiles list with pagination */}
            <FlatList
                data={users}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                numColumns={2}
                contentContainerStyle={{ paddingBottom: 40, backgroundColor: '#e74c3c' }}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
                getItemLayout={getItemLayout}
                removeClippedSubviews={true} // Improves performance on Android
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={21}
            />

            {/* Show message if no users found */}
            {users.length === 0 && !loading && (
                <Text style={{ textAlign: 'center' }}>No users found.</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, marginBottom: 20, fontWeight: 'bold' },
    footer: { padding: 10, alignItems: 'center' },
    logoutButton: {
        backgroundColor: '#e74c3c',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
        marginRight: 10,
    },
    logoutText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
});
