// lib/favorites.ts
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const getApiBaseUrl = () =>
  Platform.OS === 'android' ? 'http://10.0.2.2:3002' : 'http://localhost:3002';

interface ToggleFavoriteParams {
  userId: string;
  hotelId: string;
}

export interface Favorite {
  _id: string;
  userId: string;
  hotelId: string;
}

export const getFavorites = async (): Promise<Favorite[]> => {
  try {
    const token = await SecureStore.getItemAsync('token');
    if (!token) throw new Error('No token found');

    const res = await axios.get(`${getApiBaseUrl()}/api/favorites`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log(res.data);

    return res.data as Favorite[];
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return []; // Return empty array instead of throwing (safe for UI)
  }
};

export const toggleFavorite = async ({
  userId,
  hotelId,
}: ToggleFavoriteParams) => {
  try {
    const token = await SecureStore.getItemAsync('token');
    if (!token) throw new Error('No token found');

    const res = await axios.post(
      `${getApiBaseUrl()}/api/favorites/`,
      { userId, hotelId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return res.data; // Expecting { isFavorite: boolean, favorite?: Favorite }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw error;
  }
};
