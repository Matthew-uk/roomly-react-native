import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Animated, ImageProps, View } from 'react-native';

/**
 * Drop-in image with a skeleton & fade-in transition.
 * - Shows a gray placeholder (with animate-pulse if you use NativeWind)
 * - Crossfades the image in on load
 * - Preserves layout with a fixed height or aspectRatio (pass via style)
 */
type Props = {
  uri: string;
  /**
   * Optional: show a spinner on the skeleton
   */
  showSpinner?: boolean;
  /**
   * Optional: className (NativeWind). Otherwise use `style`.
   */
  className?: string;
  /**
   * You can pass any Image props (resizeMode, etc)
   */
  imageProps?: Omit<ImageProps, 'source'>;
  /**
   * Children render on top (e.g., heart button)
   */
  children?: React.ReactNode;
};

export default function SkeletonImage({
  uri,
  showSpinner = false,
  className,
  imageProps,
  children,
}: Props) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const fade = useRef(new Animated.Value(0)).current;

  // When the URI changes, reset state
  useEffect(() => {
    setLoaded(false);
    setErrored(false);
    fade.setValue(0);
  }, [uri]);

  const onLoad = () => {
    setLoaded(true);
    Animated.timing(fade, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  };

  const onError = () => {
    setErrored(true);
  };

  // If error, keep the skeleton but stop pulsing
  const skeletonCls = useMemo(
    () => `bg-gray-200 ${loaded ? '' : 'animate-pulse'} ${className ?? ''}`,
    [loaded, className],
  );

  return (
    <View className={`overflow-hidden ${className ?? ''}`}>
      {/* Skeleton layer (behind) */}
      <View className={skeletonCls} style={[{ width: '100%', height: '100%' }]}>
        {showSpinner && !loaded && !errored && (
          <View className="absolute inset-0 items-center justify-center">
            <ActivityIndicator />
          </View>
        )}
      </View>

      {/* Real image layer (fades in) */}
      {!errored && (
        <Animated.Image
          source={{ uri }}
          onLoad={onLoad}
          onError={onError}
          style={[
            {
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              opacity: fade,
            },
            imageProps?.style as any,
          ]}
          {...imageProps}
        />
      )}

      {/* Overlay (e.g. heart button) */}
      {children}
    </View>
  );
}
