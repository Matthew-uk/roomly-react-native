// app/(tabs)/_layout.tsx
import BottomTabBarIcon from '@/components/dashboard/BottomTabBarIcon';
import FullSkeleton from '@/components/skeletons/FullSkeleton';
import { useAuthStore } from '@/store/auth.store';
import { Tabs } from 'expo-router';
import { CalendarDays, Heart, Home, Search, User } from 'lucide-react-native';
import React, { useEffect } from 'react';

export default function TabLayout() {
  // Use separate selectors to keep TypeScript inference clean
  const fetchAuthenticatedUser = useAuthStore((s) => s.fetchAuthenticatedUser);
  const isLoading = useAuthStore((s) => s.isLoading);

  useEffect(() => {
    fetchAuthenticatedUser();
  }, [fetchAuthenticatedUser]);

  if (isLoading) {
    return <FullSkeleton />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
          borderBottomLeftRadius: 50,
          borderBottomRightRadius: 50,
          marginHorizontal: 15,
          height: 60,
          borderWidth: 1,
          borderColor: '#4f46e5',
          position: 'absolute',
          bottom: 20,
          backgroundColor: '#fff',
          shadowColor: '#4f46e5',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3.5,
          elevation: 5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <BottomTabBarIcon
              icon={Home}
              label="Home"
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <BottomTabBarIcon
              icon={Search}
              label="Search"
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <BottomTabBarIcon
              icon={CalendarDays}
              label="Bookings"
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <BottomTabBarIcon
              icon={Heart}
              label="Favorites"
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <BottomTabBarIcon
              icon={User}
              label="Profile"
              color={color}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}
