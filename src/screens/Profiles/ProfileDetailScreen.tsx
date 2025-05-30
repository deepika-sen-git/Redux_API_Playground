import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { DUMMY_API_KEY } from '../../constants/api';



type Props = NativeStackScreenProps<RootStackParamList, 'ProfileDetail'>;

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
    location: {
        street: string;
        city: string;
        state: string;
        country: string;
        timezone: string;
    };
}

export default function ProfileDetailScreen({ route }: Props) {
    const { id } = route.params;
    const [user, setUser] = useState<UserDetail | null>(null);
    console.log(user);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserDetail = async () => {
            try {
                const response = await fetch(`https://dummyapi.io/data/v1/user/${id}`, {
                    headers: { 'app-id': DUMMY_API_KEY },
                });
                const data = await response.json();
                setUser(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserDetail();
    }, [id]);

    if (loading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading user details...</Text>
            </View>
        );
    }

    if (!user) {
        return (
            <View style={styles.loading}>
                <Text>User not found</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image source={{ uri: user.picture }} style={styles.image} />
            <Text style={styles.name}>
                {user.title} {user.firstName} {user.lastName}
            </Text>
            <Text style={styles.info}>Gender: {user.gender}</Text>
            <Text style={styles.info}>Email: {user.email}</Text>
            <Text style={styles.info}>DOB: {user.dateOfBirth}</Text>
            <Text style={styles.info}>Phone: {user.phone}</Text>
            <Text style={styles.info}>Location: {user.location.city}, {user.location.state}, {user.location.country}</Text>
            <Text style={styles.info}>Timezone: {user.location.timezone}</Text>
            {/* <ProfileMap
                street={user.location.street}
                city={user.location.city}
                state={user.location.state}
                country={user.location.country}
            /> */}

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    container: { alignItems: 'center', padding: 20, backgroundColor: '#f0ffff', },
    image: { width: 150, height: 150, borderRadius: 10, marginBottom: 20 },
    name: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
    info: { fontSize: 16, marginBottom: 5 },
});
