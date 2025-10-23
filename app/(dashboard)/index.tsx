import DashboardHeader from '@/components/dashboard/DashboardHeader';
import PropertyCard, {
  PropertyCardProps,
} from '@/components/dashboard/PropertyCard';
import PropertyCardSkeleton from '@/components/dashboard/propertyCardSkeleton';
import { getHotels } from '@/lib/hotels';
import axios from 'axios';
import { useFocusEffect, useNavigation } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Dashboard() {
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchedHotels, setFetchedHotels] = useState([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  type Hotel = {
    _id: string;
    title: string;
    rating: number;
    reviews: number;
    location: string;
    features?: { bedrooms?: number; bathrooms?: number };
    size?: number;
    price: number;
    images: string[];
    latitude: number;
    longitude: number;
  };

  // Get Hotels from API:
  const fetchHotels = async () => {
    try {
      setLoading(true);
      const fetchedHotels = await getHotels();
      console.log(fetchedHotels);
      setFetchedHotels(fetchedHotels);
    } catch (error: any) {
      console.log(error);
      throw new Error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchHotels();
  }, []);

  //   const hotelList = hotels as Hotel[];
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
      if (response.status !== 200) throw new Error('Failed to fetch user');
      return response.data;
    } catch (error: any) {
      console.error(
        'Error fetching current user:',
        error.response?.data || error.message,
      );
    }
  };
  useEffect(() => {
    getCurrentUser();
  }, []);

  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({ gestureEnabled: false });
    (async () => console.log(await SecureStore.getItemAsync('token')))();
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      fetchHotels();
    }, []),
  );

  // useEffect(() => {
  //   const prefetchImages = async () => {
  //     try {
  //       await Promise.all(fetchedHotels.map((h) => Image.prefetch(h.images[0])));
  //     } catch (e) {
  //       console.error('Image prefetching failed', e);
  //     } finally {
  //       setImagesLoaded(true);
  //     }
  //   };
  //   prefetchImages();
  // }, [hotelList]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <View className="flex-1 bg-white">
          <DashboardHeader />
          {/* <FilterBar /> */}
          <ScrollView
            className="flex-1 px-4"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24, rowGap: 0 }}
          >
            {loading ? (
              <>
                <PropertyCardSkeleton />
                <PropertyCardSkeleton />
                <PropertyCardSkeleton />
              </>
            ) : (
              fetchedHotels.map((hotel: PropertyCardProps) => (
                <PropertyCard key={hotel?._id} {...hotel} />
              ))
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
