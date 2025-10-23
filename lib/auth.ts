// lib/auth.ts
import { User } from '@/types/auth';
import axios, { AxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const getApiBaseUrl = () =>
  Platform.OS === 'android' ? 'http://10.0.2.2:3002' : 'http://localhost:3002';

export const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 10000,
});

// Attach token to every request (async interceptor)
api.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        // Ensure headers object exists and assign in a TS-friendly way
        if (!config.headers) config.headers = {};
        (config.headers as Record<string, string>)[
          'Authorization'
        ] = `Bearer ${token}`;
        // make sure Content-Type exists when applicable
        if (!(config.headers as Record<string, string>)['Content-Type']) {
          (config.headers as Record<string, string>)['Content-Type'] =
            'application/json';
        }
      }
    } catch (e) {
      // If SecureStore fails, we still proceed without a token
      // (you can log here if you want)
    }
    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * Returns User if authenticated, null if 401/403, or throws on other errors.
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const res = await api.get<User>('/api/users/me', {
      withCredentials: false,
    });
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      if (status === 401 || status === 403) return null;
    }
    throw err;
  }
};
