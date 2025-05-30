import AsyncStorage from '@react-native-async-storage/async-storage';

const GEOCODE_CACHE_KEY = 'geocodeCache';

export async function getCachedCoordinates(address: string) {
    const cache = await AsyncStorage.getItem(GEOCODE_CACHE_KEY);
    if (!cache) return null;
    const parsedCache = JSON.parse(cache);
    return parsedCache[address] || null;
}

export async function cacheCoordinates(address: string, coords: { lat: number; lon: number }) {
    const cache = await AsyncStorage.getItem(GEOCODE_CACHE_KEY);
    const parsedCache = cache ? JSON.parse(cache) : {};
    parsedCache[address] = coords;
    await AsyncStorage.setItem(GEOCODE_CACHE_KEY, JSON.stringify(parsedCache));
}
