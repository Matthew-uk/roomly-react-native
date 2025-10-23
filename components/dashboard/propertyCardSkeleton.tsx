// components/Card/PropertyCardSkeleton.tsx
import React, { useEffect, useRef } from 'react';
import { Animated, View, type DimensionValue } from 'react-native';

/** Reusable pulsing block for skeletons */
const SkeletonBlock = ({
  className = '',
  width,
  height,
  radius = 12,
}: {
  className?: string;
  width?: DimensionValue;
  height?: DimensionValue;
  radius?: number;
}) => {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false, // color interpolation doesn't support native driver
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: 800,
          useNativeDriver: false,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [progress]);

  const bg = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E5E7EB', '#F3F4F6'], // gray-200 -> gray-100
  });

  return (
    <View
      className={className}
      style={{ width, height, borderRadius: radius, overflow: 'hidden' }}
    >
      <Animated.View style={{ flex: 1, backgroundColor: bg }} />
    </View>
  );
};

export default function PropertyCardSkeleton() {
  return (
    <View className="bg-white mb-6 rounded-2xl p-2 border border-gray-200 shadow-sm">
      {/* Image area */}
      <View className="rounded-xl overflow-hidden mb-4 relative">
        <SkeletonBlock className="w-full" height={208} radius={12} />
        {/* Heart button placeholder */}
        <SkeletonBlock
          className="absolute top-3 right-3"
          width={36}
          height={36}
          radius={18}
        />
      </View>

      <View className="px-4 pb-4">
        {/* Price */}
        <SkeletonBlock className="mb-2" width="60%" height={16} radius={8} />

        {/* Name/title */}
        <SkeletonBlock className="mb-2" width="80%" height={18} radius={8} />

        {/* Rating row */}
        <View className="flex-row items-center mb-2">
          <SkeletonBlock className="mr-2" width={16} height={16} radius={4} />
          <SkeletonBlock className="mr-2" width={40} height={14} radius={6} />
          <SkeletonBlock width={80} height={14} radius={6} />
        </View>

        {/* Address line */}
        <View className="flex-row items-center mb-3">
          <SkeletonBlock className="mr-2" width={16} height={16} radius={4} />
          <SkeletonBlock width="70%" height={14} radius={6} />
        </View>

        {/* Size / amenity chip */}
        <SkeletonBlock className="mb-3" width={110} height={22} radius={11} />

        {/* Action buttons */}
        <View className="flex-row justify-between items-center">
          <SkeletonBlock width="48%" height={40} radius={20} />
          <SkeletonBlock width="36%" height={40} radius={20} />
        </View>
      </View>
    </View>
  );
}
