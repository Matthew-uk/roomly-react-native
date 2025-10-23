import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function CategoryTabs({ categories }: { categories: string[] }) {
  const [active, setActive] = useState('All');

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mt-4"
    >
      <View className="flex-row space-x-3 gap-3">
        {categories.map((cat, i) => (
          <TouchableOpacity
            key={i}
            className={`px-5 py-2 rounded-full ${
              active === cat ? 'bg-violet-500' : 'bg-gray-100'
            }`}
            onPress={() => setActive(cat)}
          >
            <Text
              className={`text-sm font-medium pb-4 ${
                active === cat ? 'text-white' : 'text-black'
              }`}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
