// ProfileDetailScreen: Fetches and displays detailed user profile info based on user ID

import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { fetchUserDetail } from '../../redux/slices/profileDetailSlice';
import { useEffect } from 'react';

type Props = NativeStackScreenProps<RootStackParamList, 'ProfileDetail'>;


export default function ProfileDetailScreen({ route }: Props) {
    const { id } = route.params;
    const dispatch = useDispatch<AppDispatch>();

    const { user, loading, error } = useSelector((state: RootState) => state.profileDetail);

    useEffect(() => {
        dispatch(fetchUserDetail(id));
    }, [dispatch, id]);

    // Show loading spinner while fetching
    if (loading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading user details...</Text>
            </View>
        );
    }


    // Show message if user not found
    if (error || !user) {
        return (
            <View style={styles.loading}>
                <Text>{error || 'User not found'}</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* User profile picture */}
            <Image source={{ uri: user.picture }} style={styles.image} />

            {/* User full name */}
            <Text style={styles.name}>
                {user.title} {user.firstName} {user.lastName}
            </Text>

            {/* User details */}
            <Text style={styles.info}>Gender: {user.gender}</Text>
            <Text style={styles.info}>Email: {user.email}</Text>
            <Text style={styles.info}>DOB: {new Date(user.dateOfBirth).toLocaleDateString()}</Text>
            <Text style={styles.info}>Phone: {user.phone}</Text>
            <Text style={styles.info}>
                Location: {user.location.city}, {user.location.state}, {user.location.country}
            </Text>

            {/* Optionally show ProfileMap component here */}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    container: { alignItems: 'center', padding: 20, backgroundColor: '#fff176' },
    image: { width: 150, height: 150, borderRadius: 10, marginBottom: 20 },
    name: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
    info: { fontSize: 16, marginBottom: 5 },
});
