import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export const getCurrentUser = async () => {
  const response = await axios.get('http://localhost:3002/api/users/me', {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${await SecureStore.getItemAsync('token')}`,
    },
  });
  if (response.status !== 200) {
    throw new Error('Failed to fetch user');
  }

  return response.data;
};
