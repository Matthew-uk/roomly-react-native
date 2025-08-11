import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export const getHotels = async (city: string): Promise<any> => {
  const token = await SecureStore.getItemAsync('token');
  try {
    const response = await axios.get(
      `https://roomy-backend-duq2.onrender.com/api/hotels`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (response.status !== 200) {
      throw new Error(`Error fetching hotels: ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    console.error('Failed to fetch hotels:', error);
    throw error;
  }
};
