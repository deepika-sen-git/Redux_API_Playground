import React, { useEffect, useState } from 'react';
import { Text, ActivityIndicator, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { getCachedCoordinates, cacheCoordinates } from '../utils/geocache';

interface Props {
    street: string;
    city: string;
    state?: string;
    country: string;
}

export default function ProfileMap({ street, city, state, country }: Props) {
    const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCoords = async () => {
            const address = `${country}`;

            // Try to get cached coords first
            const cached = await getCachedCoordinates(address);
            if (cached) {
                setCoords(cached);
                setLoading(false);
                return;
            }

            // If not cached, fetch from API
            try {
                const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`;
                const res = await fetch(url);
                const data = await res.json();
                if (data && data.length > 0) {
                    const newCoords = { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
                    setCoords(newCoords);
                    cacheCoordinates(address, newCoords);
                }
            } catch (e) {
                console.log('Geocoding error:', e);
            } finally {
                setLoading(false);
            }
        };

        fetchCoords();
    }, [street, city, state, country]);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
    }

    if (!coords) {
        return <Text style={styles.errorText}>Map not found</Text>;
    }

    return (
        <MapView
            style={styles.map}
            initialRegion={{
                latitude: coords.lat,
                longitude: coords.lon,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            }}
        >
            <Marker coordinate={{ latitude: coords.lat, longitude: coords.lon }} />
        </MapView>
    );
}

const styles = StyleSheet.create({
    map: {
        width: '100%',
        height: 250,
        borderRadius: 10,
        marginVertical: 10,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
    },
    errorText: {
        textAlign: 'center',
        marginVertical: 20,
        color: 'red',
    },
});
