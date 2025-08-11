import DashboardHeader from '@/components/dashboard/DashboardHeader';
import FilterBar from '@/components/dashboard/FilterBar';
import PropertyCard from '@/components/dashboard/PropertyCard';
import axios from 'axios';
import { useNavigation } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import {
  Image,
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Dashboard() {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const properties = [
    {
      title: 'Grand Royal Penthouse',
      rating: 4.9,
      reviews: 345,
      location: '123 Ocean Blvd, Miami, FL',
      features: { bedrooms: 1, bathrooms: 1 },
      size: 2500,
      price: 950,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
    },
    {
      title: 'Chic Downtown Loft',
      rating: 4.7,
      reviews: 189,
      location: '789 City Center, New York, NY',
      features: { bedrooms: 2, bathrooms: 2 },
      size: 1800,
      price: 650,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
    },
  ];

  useEffect(() => {
    const getCurrentUser = async () => {
      const token = await SecureStore.getItemAsync('token');
      if (!token) {
        console.error('No token found, user not authenticated');
        return;
      }
      try {
        const response = await axios.get(
          'https://roomy-backend-duq2.onrender.com/api/users/me',
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );
        console.log(response.data);

        if (response.status !== 200) {
          throw new Error('Failed to fetch user');
        }
        return response.data;
      } catch (error: any) {
        console.error(
          'Error fetching current user:',
          error.response?.data || error.message,
        );
      }
    };
    getCurrentUser();
  }, []);

  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({ gestureEnabled: false });
    const getToken = async () => {
      const token = await SecureStore.getItemAsync('token');
      console.log(token);
    };
    getToken();
  }, [navigation]);

  useEffect(() => {
    const prefetchImages = async () => {
      try {
        await Promise.all(
          properties.map((property) => Image.prefetch(property.image)),
        );
        setImagesLoaded(true);
      } catch (error) {
        console.error('Image prefetching failed', error);
        setImagesLoaded(true);
      }
    };
    prefetchImages();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 bg-white">
          <DashboardHeader />
          <FilterBar />
          <ScrollView className="px-4" showsVerticalScrollIndicator={false}>
            {properties &&
              properties.map((property, idx) => (
                <PropertyCard key={idx} {...property} />
              ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
