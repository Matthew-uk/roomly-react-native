// app/(tabs)/_layout.tsx
import BottomTabBarIcon from '@/components/dashboard/BottomTabBarIcon';
import { Tabs } from 'expo-router';
import { CalendarDays, Heart, Home, Search, User } from 'lucide-react-native';

export default function TabLayout() {
  return (
    // <SafeAreaView
    //   style={{ flex: 1, backgroundColor: '#fff' }}
    //   edges={['bottom']}
    // >
    <Tabs
      //   screenOptions={{
      //     headerShown: false,
      //     tabBarShowLabel: false,
      //     tabBarStyle: {
      //       position: 'absolute',
      //       height: 80,
      //       bottom: 40,
      //       shadowColor: '#1a1a1a',
      //       shadowOffset: {
      //         width: 0,
      //         height: 0,
      //       },
      //       shadowOpacity: 0.25,
      //       shadowRadius: 3.5,
      //       elevation: 5,
      //       backgroundColor: '#fff',
      //       borderTopLeftRadius: 50,
      //       borderTopRightRadius: 50,
      //       borderBottomLeftRadius: 50,
      //       borderBottomRightRadius: 50,
      //       marginHorizontal: 18,
      //     },
      //   }}
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
          bottom: 40,
          backgroundColor: '#fff',
          shadowColor: '#4f46e5',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3.5,
          elevation: 5,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
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
    // </SafeAreaView>
  );
}
