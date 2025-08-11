// components/Card/PropertyCard.tsx
import { router } from 'expo-router';
import {
  Bath,
  BedDouble,
  Heart,
  MapPin,
  Ruler,
  Star,
} from 'lucide-react-native';
import { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
interface PropertyCardProps {
  title: string;
  rating: number;
  reviews: number;
  location: string;
  features?: {
    bedrooms?: number;
    bathrooms?: number;
  };
  size?: number;
  price: number;
  image: string;
}

const HeartBox = ({ hotelId }: { hotelId?: string }) => {
  const [isHearted, setIsHearted] = useState(false);
  const handleChangeColor = () => {
    setIsHearted(!isHearted);
  };
  return (
    <TouchableOpacity
      className={`${`absolute top-3 right-3 bg-white/70 p-2 rounded-full ${
        isHearted ? 'opacity-100' : 'opacity-80'
      }`}`}
      onPress={handleChangeColor}
    >
      <Heart color={isHearted ? '#FF0000' : '#6B7280'} size={20} />
    </TouchableOpacity>
  );
};

export default function PropertyCard({
  title,
  rating,
  reviews,
  location,
  features,
  size,
  price,
  image,
}: PropertyCardProps) {
  return (
    <View className="bg-white mb-6 rounded-2xl p-2 border border-gray-200 shadow-sm">
      <View className="rounded-xl overflow-hidden mb-4 relative">
        <Image source={{ uri: image }} className="w-full h-52 object-cover" />
        <HeartBox />
      </View>
      <View className="flex-1 flex-col px-4 pb-4">
        <Text className="text-lg font-semibold text-gray-900 mb-1 font-regular">
          {title}
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
          <Text className="text-sm text-gray-600 ml-1 font-medium">
            {location}
          </Text>
        </View>

        <View className="flex-row flex-wrap gap-2 mb-2">
          {features?.bedrooms && (
            <Text className="text-sm text-gray-600 flex-row items-center font-medium">
              <BedDouble size={14} /> {features.bedrooms} Bedrooms
            </Text>
          )}
          {features?.bathrooms && (
            <Text className="text-sm text-gray-600 flex-row items-center font-medium">
              <Bath size={14} /> {features.bathrooms} Bathrooms
            </Text>
          )}
          {size && (
            <Text className="text-sm text-gray-600 flex-row items-center font-medium">
              <Ruler size={14} /> {size} sqft
            </Text>
          )}
        </View>

        <View className="flex-row justify-between items-center mt-2">
          <Text className="text-lg font-bold text-gray-900">
            ${price} / Night
          </Text>
          <TouchableOpacity className="bg-indigo-600 px-4 py-2 rounded-full">
            <Text
              className="text-white font-medium"
              onPress={() => router.push('/(details)')}
            >
              Reserve
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
