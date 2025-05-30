import React from 'react';
import { Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface ProfileCardProps {
    image: string;
    name: string;
    onPress: () => void;
}

export default function ProfileCard({ image, name, onPress }: ProfileCardProps) {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <Image source={{ uri: image }} style={styles.image} />
            <Text style={styles.name}>{name}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        backgroundColor: '#e0f7fa',
        borderRadius: 10,
        margin: 8,
        alignItems: 'center',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 150,
        resizeMode: 'cover',
        margin: 10,
        borderRadius: 10,
        marginBottom: 20

    },
    name: {
        fontSize: 16,
        paddingVertical: 10,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
