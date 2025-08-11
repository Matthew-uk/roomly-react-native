import { Link } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Profile = () => {
  return (
    <SafeAreaView>
      <Text>Profile</Text>
      <Link href="/(modal)/filter">Open Filter</Link>
    </SafeAreaView>
  );
};

export default Profile;
