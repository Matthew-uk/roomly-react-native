import DashboardHeader from '@/components/dashboard/DashboardHeader';
import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  BuildingStorefrontIcon,
  HeartIcon,
  MapPinIcon,
  ShareIcon,
  WifiIcon,
} from 'react-native-heroicons/outline';
import {
  HeartIcon as HeartSolidIcon,
  StarIcon as StarSolidIcon,
} from 'react-native-heroicons/solid';

const HotelDetailsScreen = () => {
  const [isFavorite, setIsFavorite] = React.useState(false);

  const facilities = [
    { icon: WifiIcon, label: 'Free WiFi', color: 'text-blue-500' },
    {
      icon: BuildingStorefrontIcon,
      label: 'Restaurant',
      color: 'text-green-500',
    },
    { icon: WifiIcon, label: 'Gym Access', color: 'text-purple-500' },
    { icon: BuildingStorefrontIcon, label: 'A/C', color: 'text-cyan-500' },
    { icon: WifiIcon, label: 'Spa', color: 'text-pink-500' },
    {
      icon: BuildingStorefrontIcon,
      label: 'Pet Friendly',
      color: 'text-orange-500',
    },
    { icon: WifiIcon, label: 'Pool', color: 'text-blue-400' },
    { icon: BuildingStorefrontIcon, label: 'Parking', color: 'text-gray-500' },
  ];

  const suites = [
    {
      id: 1,
      name: 'Presidential',
      description: 'Experience ultimate luxury in our spacious suite',
      price: '$899 / night',
      image:
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop',
    },
    {
      id: 2,
      name: 'Executive',
      description: 'Perfect for business travelers seeking comfort',
      price: '$599 / night',
      image:
        'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&h=300&fit=crop',
    },
    {
      id: 3,
      name: 'Deluxe King',
      description: 'Spacious room with king bed and city views',
      price: '$399 / night',
      image:
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop',
    },
    {
      id: 4,
      name: 'Standard',
      description: 'Comfortable accommodation with modern amenities',
      price: '$299 / night',
      image:
        'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop',
    },
  ];

  const reviews = [
    {
      id: 1,
      name: 'Tony John',
      rating: 5,
      comment:
        'The location was perfect, the hotel was spacious and clean, great value!',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    },
    {
      id: 2,
      name: 'Clea',
      rating: 5,
      comment: 'We loved the stay. It was a lot of fun.',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <DashboardHeader />
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View className="relative">
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=400&fit=crop',
            }}
            className="w-full h-64"
            resizeMode="cover"
          />
          <View className="absolute top-4 right-4 flex-row space-x-2">
            <TouchableOpacity className="bg-white/90 p-2 rounded-full shadow-sm">
              <ShareIcon size={20} color="#374151" />
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-white/90 p-2 rounded-full shadow-sm"
              onPress={() => setIsFavorite(!isFavorite)}
            >
              {isFavorite ? (
                <HeartSolidIcon size={20} color="#ef4444" />
              ) : (
                <HeartIcon size={20} color="#374151" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Hotel Info */}
        <View className="px-6 py-4">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            The Grand Haven
          </Text>

          <View className="flex-row items-center mb-2">
            <View className="flex-row items-center mr-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarSolidIcon key={star} size={16} color="#fbbf24" />
              ))}
            </View>
            <Text className="text-sm text-gray-600 font-regular">
              156 Reviews
            </Text>
          </View>

          <View className="flex-row items-center mb-4">
            <MapPinIcon size={16} color="#6b7280" />
            <Text className="text-sm text-gray-600 ml-1 font-regular">
              Downtown Ave, Manhattan
            </Text>
          </View>

          <TouchableOpacity className="bg-blue-600 py-3 px-6 rounded-lg mb-6">
            <Text className="text-white text-center font-medium text-base">
              Book Now
            </Text>
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View className="px-6 py-4 border-t border-gray-100">
          <Text className="text-lg font-medium text-gray-900 mb-3">
            About The Grand Haven
          </Text>
          <Text className="text-gray-600 font-regular leading-6">
            Nestled in the heart of Manhattan City, The Grand Haven offers a
            luxurious escape with breathtaking views and world-class amenities.
            Our elegantly designed rooms and suites provide the perfect blend of
            comfort and sophistication.
          </Text>
          <TouchableOpacity className="mt-3">
            <Text className="text-blue-600 font-medium">Read more</Text>
          </TouchableOpacity>
        </View>

        {/* Reviews Section */}
        <View className="px-6 py-4 border-t border-gray-100">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-medium text-gray-900">Reviews</Text>
            <TouchableOpacity>
              <Text className="text-blue-600 font-medium">See all</Text>
            </TouchableOpacity>
          </View>

          {reviews.map((review) => (
            <View key={review.id} className="flex-row mb-4">
              <Image
                source={{ uri: review.avatar }}
                className="w-10 h-10 rounded-full mr-3"
              />
              <View className="flex-1">
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="font-medium text-gray-900">
                    {review.name}
                  </Text>
                  <View className="flex-row">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarSolidIcon
                        key={star}
                        size={12}
                        color={star <= review.rating ? '#fbbf24' : '#e5e7eb'}
                      />
                    ))}
                  </View>
                </View>
                <Text className="text-sm font-regular text-gray-600 leading-5">
                  {review.comment}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Facilities Section */}
        <View className="px-6 py-4 border-t border-gray-100">
          <Text className="text-lg font-medium text-gray-900 mb-4">
            Facilities & Services
          </Text>
          <View className="flex-row flex-wrap">
            {facilities.map((facility, index) => (
              <View key={index} className="w-1/4 items-center mb-4">
                <View className="bg-gray-50 p-3 rounded-full mb-2">
                  <facility.icon size={24} color="#6b7280" />
                </View>
                <Text className="text-xs text-gray-600 text-center font-regular">
                  {facility.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Available Suites */}
        <View className="px-6 py-4 border-t border-gray-100 pb-20">
          <Text className="text-lg font-medium text-gray-900 mb-4">
            Available Suites
          </Text>
          <View className="flex flex-row flex-wrap justify-between">
            {suites.map((suite) => (
              <View
                key={suite.id}
                className="w-[48%] mb-4 bg-white rounded-2xl p-2 border border-gray-200 shadow-sm"
              >
                <Image
                  source={{ uri: suite.image }}
                  className="w-full h-32 rounded-lg mb-2"
                  resizeMode="cover"
                />
                <Text className="font-medium text-gray-900 mb-1 text-sm">
                  {suite.name}
                </Text>
                <Text className="text-xs font-regular text-gray-600 mb-2 leading-4">
                  {suite.description}
                </Text>
                <Text className="text-blue-600 font-medium mb-2 text-xs mt-2">
                  {suite.price}
                </Text>
                <TouchableOpacity className="bg-blue-600 py-2 px-4 rounded-md">
                  <Text className="text-white text-center text-xs font-medium">
                    Book Now
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HotelDetailsScreen;
