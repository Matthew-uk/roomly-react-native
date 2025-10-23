import PropertyCardSkeleton from '@/components/dashboard/propertyCardSkeleton';
import HeaderGreetingSkeleton from '@/components/skeletons/HeaderSkeleton';
import React from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

const FullSkeleton = () => {
  return (
    <SafeAreaView>
      <View className="flex flex-col px-4">
        <HeaderGreetingSkeleton />
        <ScrollView
          //   className="flex-1 px-4"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24, rowGap: 0 }}
        >
          {/* <> */}
          <PropertyCardSkeleton />
          <PropertyCardSkeleton />
          <PropertyCardSkeleton />
          {/* </> */}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default FullSkeleton;
