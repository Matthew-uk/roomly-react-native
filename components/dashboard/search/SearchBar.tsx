import { Search, SlidersHorizontal } from 'lucide-react-native';
import { TextInput, TouchableOpacity, View } from 'react-native';

export default function SearchBar({ placeholder }: { placeholder: string }) {
  return (
    <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
      <Search size={17} color="gray" />
      <TextInput
        placeholder={placeholder}
        className="flex-1 ml-1 text-base font-regular mb-2"
        placeholderTextColor="gray"
      />
      <TouchableOpacity>
        <SlidersHorizontal size={16} color="black" />
      </TouchableOpacity>
    </View>
  );
}
