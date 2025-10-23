// components/HeaderGreetingSkeleton.tsx
import React from 'react';
import { View } from 'react-native';

const HeaderGreetingSkeleton = () => {
  return (
    <View className="flex-row items-center justify-between pl-4 pr-10 pb-4">
      {/* Left: avatar + texts */}
      <View className="flex-row items-center gap-3">
        {/* Avatar skeleton */}
        <View className="h-10 w-10 rounded-full bg-gray-200" />

        {/* Greeting + Name skeleton */}
        <View className="flex-1">
          {/* greeting line */}
          <View className="flex-row items-center">
            <View className="h-3 w-20 rounded bg-gray-200" />
            <View className="mx-2 flex-1 border-b border-dashed border-gray-200" />
          </View>

          {/* name line */}
          <View className="mt-1 h-4 w-32 rounded bg-gray-200" />
        </View>
      </View>

      {/* Right: bell skeleton */}
      <View className="h-6 w-6 rounded-full bg-gray-200" />
    </View>
  );
};

export default HeaderGreetingSkeleton;
