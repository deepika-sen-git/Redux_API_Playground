import React from 'react';
import { Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

// Define the props type for the ProfileCard
interface ProfileCardProps {
    image: string; // URL of the image to display
    name: string;  // Name text to display
    onPress: () => void; // Function to execute when card is pressed
}

// Functional component for rendering a profile card
function ProfileCard({ image, name, onPress }: ProfileCardProps) {
    return (
        <TouchableOpacity
            style={styles.card}
            onPress={onPress}
            activeOpacity={0.7} // Reduces opacity when pressed
        >
            <Image source={{ uri: image }} style={styles.image} />
            <Text style={styles.name}>{name}</Text>
        </TouchableOpacity>
    );
}

// React.memo prevents unnecessary re-renders if props don't change
export default React.memo(ProfileCard);

// Styles for the component
const styles = StyleSheet.create({
    card: {
        flex: 1,
        margin: 10,
        padding: 15,
        backgroundColor: '#f0f8ff',
        borderRadius: 8,
        alignItems: 'center',
        height: 220,
    },
    image: {
        width: "100%",
        height: 150,
        borderRadius: 10,
        marginBottom: 10,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
});
