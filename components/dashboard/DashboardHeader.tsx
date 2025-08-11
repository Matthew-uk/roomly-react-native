// components/Header/DashboardHeader.tsx
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Menu, Search, User } from 'lucide-react-native';
import React, { useCallback } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import BottomSheet from './BottomSheet';

export default function DashboardHeader() {
  const bottomSheetRef = React.useRef<BottomSheetModal>(null);
  const openModal = () => {
    bottomSheetRef.current?.present();
  };
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);
  return (
    <View className="py-4 px-6 bg-white">
      <BottomSheet ref={bottomSheetRef} />
      <View className="flex-row justify-between items-center mb-4">
        <TouchableOpacity>
          <Menu size={24} color="#6B7280" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-indigo-700">Roomly Inc.</Text>
        <TouchableOpacity onPress={openModal}>
          <User size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-2">
        <Search size={20} color="#6B7280" />
        <TextInput
          placeholder="Anywhere, 23 - 31 May, 2 guests"
          placeholderTextColor="#6B7280"
          className="ml-2 flex-1 text-gray-800"
        />
      </View>
    </View>
  );
}
