import { Heart } from 'lucide-react-native';
import { Image, Text, TouchableOpacity, View } from 'react-native';

export default function PropertyCard({ property }: any) {
  return (
    <TouchableOpacity className="flex-row bg-white rounded-2xl border border-primary shadow-sm shadow-primary px-3 py-2 mb-4">
      <Image
        source={{ uri: property.image }}
        className="w-28 h-28 rounded-xl"
      />

      <View className="flex-1 ml-4">
        {/* Title & Location */}
        <Text className="text-base font-medium font-regular">
          {property.title}
        </Text>
        <Text className="text-gray-500 text-sm font-regular">
          {property.location}
        </Text>

        {/* Price & Rating */}
        <View className="flex-row items-center justify-between mt-3">
          <Text className="text-violet-500 font-bold text-base">
            ${property.price}
          </Text>
          <View className="flex-row items-center bg-violet-50 px-2 py-1 rounded-md">
            <Text className="text-sm text-primary font-regular">
              ⭐ {property.rating}
            </Text>
          </View>
        </View>
        {/* <TouchableOpacity className="flex items-center justify-center bg-primary rounded-lg p-1 w-[60px]">
          <Text className="font-regular text-sm text-white">Reserve</Text>
        </TouchableOpacity> */}
      </View>

      <TouchableOpacity className="w-max h-[25px]">
        <Heart size={20} color="gray" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
