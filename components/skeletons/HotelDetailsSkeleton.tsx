// components/skeletons/HotelDetailsSkeleton.tsx
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import React from 'react';
import { ScrollView, StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function Circle({
  size = 40,
  className = '',
}: {
  size?: number;
  className?: string;
}) {
  return (
    <View
      className={`bg-gray-200 rounded-full ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

function Line({
  w = 'w-full',
  h = 14,
  className = '',
}: {
  w?: string;
  h?: number;
  className?: string;
}) {
  return (
    <View
      className={`bg-gray-200 rounded-md ${w} ${className}`}
      style={{ height: h }}
    />
  );
}

function SuiteCardSkeleton() {
  return (
    <View className="w-[48%] mb-4 bg-white rounded-2xl p-2 border border-gray-200 shadow-sm">
      <View className="w-full h-32 rounded-lg bg-gray-200 mb-2" />
      <Line w="w-3/4" h={12} className="mb-2" />
      <Line w="w-full" h={10} className="mb-2" />
      <Line w="w-1/2" h={10} className="mb-3" />
      <View className="bg-blue-200/60 py-3 rounded-md" />
    </View>
  );
}

export default function HotelDetailsSkeleton() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <DashboardHeader />
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <ScrollView
        className="flex-1 animate-pulse"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View className="relative">
          <View className="w-full h-64 bg-gray-200" />
          <View className="absolute top-4 left-4 flex flex-row gap-4">
            <Circle size={36} className="bg-white/70" />
          </View>
          <View className="absolute top-4 right-4 flex flex-row gap-4">
            <Circle size={36} className="bg-white/70" />
            <Circle size={36} className="bg-white/70" />
          </View>
        </View>

        {/* Info */}
        <View className="px-6 py-4">
          <Line w="w-2/3" h={22} className="mb-3" />
          <View className="flex-row items-center mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <View key={i} className="w-4 h-4 bg-gray-200 rounded mr-1" />
            ))}
            <Line w="w-16" h={12} className="ml-3" />
          </View>
          <View className="flex-row items-center mb-4">
            <View className="w-4 h-4 bg-gray-200 rounded mr-2" />
            <Line w="w-40" h={12} />
          </View>
          <View className="bg-blue-200/60 py-4 rounded-lg" />
        </View>

        {/* About */}
        <View className="px-6 py-4 border-t border-gray-100">
          <Line w="w-24" h={16} className="mb-3" />
          <Line className="mb-2" />
          <Line w="w-11/12" className="mb-2" />
          <Line w="w-10/12" />
        </View>

        {/* Facilities */}
        <View className="px-6 py-4 border-t border-gray-100">
          <Line w="w-48" h={16} className="mb-4" />
          <View className="flex-row flex-wrap">
            {Array.from({ length: 8 }).map((_, i) => (
              <View key={i} className="w-1/4 items-center mb-4">
                <Circle size={44} className="mb-2" />
                <Line w="w-14" h={10} />
              </View>
            ))}
          </View>
        </View>

        {/* Suites */}
        <View className="px-6 py-4 border-t border-gray-100 pb-20">
          <Line w="w-40" h={16} className="mb-4" />
          <View className="flex flex-row flex-wrap justify-between">
            {Array.from({ length: 4 }).map((_, i) => (
              <SuiteCardSkeleton key={i} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
