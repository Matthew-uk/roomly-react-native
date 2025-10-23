import DashboardHeader from '@/components/dashboard/DashboardHeader';
import FavoriteCard from '@/components/dashboard/FavoriteCard';
import { PropertyCardProps } from '@/components/dashboard/PropertyCard';
import PropertyCardSkeleton from '@/components/dashboard/propertyCardSkeleton';
import { getFavorites } from '@/lib/favorites';
import { getHotels } from '@/lib/hotels';
import { useAuthStore } from '@/store/auth.store';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

const Favorites = () => {
  const [favorites, setFavorites] = useState<PropertyCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteTrigger, setFavoriteTrigger] = useState(false);
  const { user } = useAuthStore();

  const fetchFavoritesAndHotels = useCallback(async () => {
    try {
      setLoading(true);
      if (!user) return;

      const favs = await getFavorites();
      const favoriteHotelIds = favs.map((f: any) => f.hotelId);

      const allHotels = await getHotels();
      const favoriteHotels = allHotels.filter((hotel: any) =>
        favoriteHotelIds.includes(hotel._id),
      );

      setFavorites(favoriteHotels);
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);
  const handleFavorite = () => {
    setFavoriteTrigger(!favoriteTrigger);
  };
  // 👇 This re-fetches favorites every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchFavoritesAndHotels();
    }, [fetchFavoritesAndHotels, favoriteTrigger]),
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex flex-col">
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24, rowGap: 0 }}
        >
          <DashboardHeader />
          {loading ? (
            <View className="px-4">
              {/* <HeaderGreetingSkeleton /> */}
              <PropertyCardSkeleton />
              <PropertyCardSkeleton />
              <PropertyCardSkeleton />
            </View>
          ) : favorites.length > 0 ? (
            <View className="px-4">
              {/*  */}
              {favorites.map((hotel: PropertyCardProps) => (
                <FavoriteCard
                  key={hotel._id}
                  {...hotel}
                  handleFavorite={handleFavorite}
                />
              ))}
            </View>
          ) : (
            <View className="flex items-center justify-center py-10 h-[80vh]">
              <Text className="text-gray-500 text-center text-base font-regular">
                No favorites yet. Start exploring and add some!
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Favorites;
