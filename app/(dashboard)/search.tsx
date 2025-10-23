import CategoryTabs from '@/components/dashboard/search/CategoryTabs';
import Header from '@/components/dashboard/search/Header';
import PropertyCard from '@/components/dashboard/search/PropertyCard';
import SearchBar from '@/components/dashboard/search/SearchBar';
import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const categories = ['All', 'House', 'Villa', 'Apartments', 'Others'];

const properties = [
  {
    id: '1',
    title: 'Lucky Lake Apartments',
    location: 'Beijing, China',
    price: 1234,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
  },
  {
    id: '2',
    title: 'Home Away From Home',
    location: 'Beijing, China',
    price: 1234,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
  },
  {
    id: '3',
    title: 'Tranquil Tavern Apartments',
    location: 'Beijing, China',
    price: 1234,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511',
  },
  {
    id: '4',
    title: 'Tropicana Del Norte De Forte',
    location: 'Beijing, China',
    price: 1234,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed',
  },
  {
    id: '5',
    title: 'Kotanà Mongróòvè',
    location: 'Haiti, Milan',
    price: 1234,
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
  },
  {
    id: '6',
    title: 'Kotanà Mongróòvè',
    location: 'Haiti, Milan',
    price: 1234,
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
  },
  {
    id: '7',
    title: 'Kotanà Mongróòvè',
    location: 'Haiti, Milan',
    price: 1234,
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
  },
  {
    id: '8',
    title: 'Kotanà Mongróòvè',
    location: 'Haiti, Milan',
    price: 1234,
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
  },
];

export default function SearchScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 bg-white px-4">
        <Header title="Search for Your Ideal Home" />

        <SearchBar placeholder="Beijing China" />

        <CategoryTabs categories={categories} />

        <Text className="text-lg font-medium mt-6 mb-4">
          Found 182 Apartments
        </Text>

        <FlatList
          data={properties}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PropertyCard property={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </View>
    </SafeAreaView>
  );
}
