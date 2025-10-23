// components/HeaderGreeting.tsx
import { useAuthStore } from '@/store/auth.store';
import { Bell } from 'lucide-react-native';
import React from 'react';
import { Image, Text, View } from 'react-native';

type Props = {
  name?: string;
  greeting?: string;
  avatarUri?: string;
  onBellPress?: () => void;
  hasUnread?: boolean;
};

const HeaderGreeting: React.FC<Props> = ({
  name = 'Nathan Cress',
  greeting = 'Good Morning',
  avatarUri = 'https://imgs.search.brave.com/eRGeeJKZb_O62YbRNAH_xzX0AW7_jXzC3uau5wp4CFI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by9w/b3J0cmFpdC1tYW4t/c21pbGluZy1jaXR5/XzIzLTIxNTA3NzEx/MzUuanBnP3NlbXQ9/YWlzX2luY29taW5n/Jnc9NzQwJnE9ODA',
  onBellPress,
  hasUnread = true,
}) => {
  const userData = useAuthStore((s) => s.user);
  console.log('User data:');
  console.log(userData);
  return (
    <View className="flex-row items-center justify-between pl-4 pr-10 pb-4">
      {/* Left: avatar + texts */}
      <View className="flex-row items-center gap-3">
        <Image source={{ uri: avatarUri }} className="h-10 w-10 rounded-full" />

        <View className="flex-1">
          {/* greeting with dashed divider */}
          <View className="flex-row items-center">
            <Text className="text-gray-500 text-sm font-regular">
              {greeting}
            </Text>
            <View className="mx-2 flex-1 border-b border-dashed border-gray-300" />
          </View>

          <Text className="text-base font-semibold text-black font-medium">
            {userData?.name}
          </Text>
        </View>
      </View>

      {/* Right: bell with unread dot */}
      {/* <TouchableOpacity
        onPress={onBellPress}
        className="items-center justify-center rounded-full border border-gray-200"
        activeOpacity={0.7}
      > */}
      <Bell size={20} />
      {/* {hasUnread && (
          <View className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-blue-500 ring-2 ring-white" />
        )} */}
      {/* </TouchableOpacity> */}
    </View>
  );
};

export default HeaderGreeting;
