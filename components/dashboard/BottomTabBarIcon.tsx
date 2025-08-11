// components/Nav/BottomTabBarIcon.tsx
import { View } from 'react-native';

export default function BottomTabBarIcon({ icon, label, focused }: any) {
  const Icon = icon;
  return (
    <View className="flex-1 items-center justify-center w-full mt-5">
      <Icon size={22} color={focused ? '#4f46e5' : '#6b7280'} />
      {/* <Text
        style={{
          fontSize: 11,
          color: focused ? '#4f46e5' : '#6b7280',
          marginTop: 2,
          fontWeight: focused ? '600' : '500',
        }}
      >
        {label}
      </Text> */}
    </View>
  );
}
