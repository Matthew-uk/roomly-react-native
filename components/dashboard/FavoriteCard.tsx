import SkeletonImage from '@/components/skeletons/ImageSkeleton';
import { getFavorites, toggleFavorite } from '@/lib/favorites';
import { useAuthStore } from '@/store/auth.store';
import { router } from 'expo-router';
import { Heart, MapPin, Navigation, Ruler, Star } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export interface PropertyCardProps {
  _id: string;
  name: string;
  description: string;
  address: string;
  rating: number;
  reviews: number;
  location: string;
  amenities?: string[];
  size?: number;
  minPrice: number;
  maxPrice: number;
  images: string[];
  latitude: number;
  longitude: number;
  handleFavorite: () => void;
}

const HeartBox = ({
  hotelId,
  handleToggle,
}: {
  hotelId?: string;
  handleToggle: () => void;
}) => {
  const [isHearted, setIsHearted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();

  // Preload heart state when user is logged in
  useEffect(() => {
    if (!user || !hotelId) return;

    (async () => {
      const favorites = await getFavorites();
      setIsHearted(favorites.some((fav) => fav.hotelId === hotelId));
    })();
  }, [hotelId, user]);

  const handleToggleFavorite = async () => {
    if (!user) {
      router.push('/(auth)/login');
      return;
    }

    try {
      setLoading(true);
      const res = await toggleFavorite({ userId: user.id, hotelId: hotelId! });

      // API should return { isFavorite: boolean }
      setIsHearted(res?.isFavorite ?? !isHearted);
      handleToggle();
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      className={`absolute top-3 right-3 bg-white/70 p-2 rounded-full ${
        isHearted ? 'opacity-100' : 'opacity-80'
      }`}
      onPress={handleToggleFavorite}
      activeOpacity={0.8}
      disabled={loading}
    >
      <Heart
        color={isHearted ? '#636AE8' : '#6B7280'}
        fill={isHearted ? '#636AE8' : '#6B7280'}
        size={20}
      />
    </TouchableOpacity>
  );
};

export default function FavoriteCard(props: PropertyCardProps) {
  const {
    _id,
    name,
    rating,
    reviews,
    size,
    minPrice,
    maxPrice,
    address,
    images,
    latitude,
    longitude,
  } = props;

  const cover = images?.[0];

  return (
    <View className="bg-white mb-6 rounded-2xl border border-gray-200">
      <View className="rounded-t-xl overflow-hidden mb-4 relative">
        <SkeletonImage
          uri={cover}
          className="w-full h-52"
          showSpinner={false}
          imageProps={{ resizeMode: 'cover' }}
        >
          <HeartBox hotelId={_id} handleToggle={props.handleFavorite} />
        </SkeletonImage>
      </View>

      <View className="flex-1 flex-col px-4 pb-4">
        <Text className="text-lg font-bold text-gray-900">
          ₦{minPrice.toLocaleString()} - ₦{maxPrice.toLocaleString()} / Night
        </Text>

        <Text className="text-lg font-semibold text-gray-900 mb-1 font-regular">
          {name}
        </Text>

        <View className="flex-row items-center mb-1">
          <Star color="#FACC15" size={16} />
          <Text className="text-sm ml-1 mr-2 text-gray-700 font-regular">
            {rating}
          </Text>
          <Text className="text-sm text-gray-500 font-regular">
            ({reviews} reviews)
          </Text>
        </View>

        <View className="flex-row items-center mb-2">
          <MapPin size={16} color="#6B7280" />
          <Text className="text-sm text-gray-600 ml-1 font-regular">
            {address}
          </Text>
        </View>

        <View className="flex-row flex-wrap gap-2 mb-2">
          {size && (
            <Text className="text-sm text-gray-600 flex-row items-center font-medium">
              <Ruler size={14} /> {size} sqft
            </Text>
          )}
        </View>

        <View className="flex flex-row justify-between items-center">
          <TouchableOpacity
            className="bg-gray-100 px-4 py-2 rounded-full flex flex-row gap-4 items-center justify-between"
            onPress={() =>
              router.push({
                pathname: '/(modal)/maps',
                params: { lat: String(latitude), lon: String(longitude), name },
              })
            }
          >
            <Navigation size={20} color={'#fb923c'} />
            <Text className="text-gray-900 text-sm text-center font-medium">
              View on Map
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-indigo-600 px-4 py-2 rounded-full"
            onPress={() => router.push(`/(details)/hotel/${_id}`)}
          >
            <Text className="text-white font-medium">Reserve</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
