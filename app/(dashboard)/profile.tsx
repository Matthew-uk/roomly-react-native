import { useRouter } from 'expo-router';
import {
  Bell,
  Calendar,
  ChevronRight,
  CreditCard,
  Info,
  Languages,
  LogOut,
  Pencil,
  Shield,
  User,
  Users,
} from 'lucide-react-native';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();

  const menuItems = [
    { icon: Calendar, label: 'My Booking', route: 'my-booking' },
    { icon: CreditCard, label: 'Payments', route: 'payments' },
    { icon: User, label: 'Profile', route: 'profile-details' },
    { icon: Bell, label: 'Notification', route: 'notifications' },
    { icon: Shield, label: 'Security', route: 'security' },
    { icon: Languages, label: 'Language', route: 'language' },
    { icon: Info, label: 'Help Center', route: 'help-center' },
    { icon: Users, label: 'Invite Friends', route: 'invite-friends' },
  ];

  return (
    <ScrollView className="flex-1 bg-white px-6 pt-12">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-8">
        <Text className="text-xl font-medium">Profile</Text>
        <Bell size={22} color="black" />
      </View>

      {/* Avatar */}
      <View className="items-center mb-4">
        <View className="relative">
          <Image
            source={{ uri: 'https://i.pravatar.cc/300' }}
            className="w-28 h-28 rounded-full"
          />
          <TouchableOpacity className="absolute bottom-0 right-0 bg-violet-500 p-2 rounded-full">
            <Pencil size={16} color="white" />
          </TouchableOpacity>
        </View>
        <Text className="text-lg font-medium mt-4">Adrian Hajdin</Text>
      </View>

      {/* Menu Items */}
      <View className="mt-4">
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            className="flex-row items-center py-4 border-b border-gray-200"
            // onPress={() => router.push(`/${item.route}`)}
          >
            <item.icon size={22} color="black" />
            <View className="flex flex-row justify-between w-full pr-6">
              <Text className="ml-4 text-base font-regular">{item.label}</Text>
              <ChevronRight size={19} />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout */}
      <TouchableOpacity
        className="flex-row items-center py-4 mt-4"
        onPress={() => alert('Logged out')}
      >
        <LogOut size={22} color="red" />
        <Text className="ml-3 text-red-500 text-base">Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
