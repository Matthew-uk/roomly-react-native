import { Link } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Bookings = () => {
  return (
    <SafeAreaView>
      <Text>Bookings</Text>
      <Link href="/(modal)/maps">Open Maps</Link>
    </SafeAreaView>
  );
};

export default Bookings;
