import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { DUMMY_API_KEY } from '../../constants/api';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfileCard from '../../components/ProfileCard'; // adjust path as needed

type Props = NativeStackScreenProps<RootStackParamList, 'ProfilesList'>;

interface User {
    id: string;
    title: string;
    firstName: string;
    lastName: string;
    picture: string;
}

export default function ProfilesListScreen({ navigation }: Props) {
    const [users, setUsers] = useState<User[]>([]);


    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);

    const LIMIT = 10;
    const dispatch = useDispatch();

    // const logoutHandler = async () => {
    //     await AsyncStorage.removeItem('token');
    //     await AsyncStorage.removeItem('email');
    //     dispatch(logout());
    //     navigation.reset({
    //         index: 0,
    //         routes: [{ name: 'SignIn' }],
    //     });
    // };


    const logoutHandler = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        await AsyncStorage.removeItem('token');
                        await AsyncStorage.removeItem('email');
                        dispatch(logout());
                    },
                },
            ],
            { cancelable: true }
        );
    };


    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={logoutHandler} style={styles.logoutButton}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            ),
        });
    });


    useEffect(() => {
        const fetchUsers = async () => {
            if (loading) return;
            if (total !== 0 && users.length >= total) return;

            setLoading(true);
            try {
                const response = await fetch(
                    `https://dummyapi.io/data/v1/user?limit=${LIMIT}&page=${page}`,
                    {
                        headers: { 'app-id': DUMMY_API_KEY },
                    }
                );
                const data = await response.json();

                // Filter out duplicates before adding new users
                const newUsers = data.data.filter(
                    (newUser: User) => !users.some(user => user.id === newUser.id)
                );

                setUsers(prev => [...prev, ...newUsers]);
                setTotal(data.total);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [page, total, users, loading]);

    const loadMore = () => {
        if (!loading && users.length < total) {
            setPage(prev => prev + 1);
        }
    };


    const renderItem = ({ item }: { item: User }) => (
        <ProfileCard
            image={item.picture}
            name={`${item.title} ${item.firstName} ${item.lastName}`}
            onPress={() => navigation.navigate('ProfileDetail', { id: item.id })}
        />
    );

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
            <FlatList
                data={users}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                numColumns={2} // shows two cards per row
                contentContainerStyle={{ paddingBottom: 20 }}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
            />

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, marginBottom: 20, fontWeight: 'bold' },
    item: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: '#f0ffff',
        marginBottom: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    image: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
    name: { fontSize: 18 },
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
    }

});
