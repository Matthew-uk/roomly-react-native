import { useRouter } from 'expo-router';
import { ArrowLeft, Bell } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

export default function Header({ title }: { title: string }) {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between mb-6">
      <TouchableOpacity onPress={() => router.back()}>
        <ArrowLeft size={24} color="black" />
      </TouchableOpacity>
      <Text className="text-base font-medium">{title}</Text>
      <TouchableOpacity>
        <Bell size={22} color="black" />
      </TouchableOpacity>
    </View>
  );
}
