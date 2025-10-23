import { Image as ExpoImage } from 'expo-image';
import React, { useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  TouchableOpacity,
  View,
} from 'react-native';
import FullscreenImageModal from './FullscreenImageModal';

const { width } = Dimensions.get('window');

type Props = {
  images?: string[];
  height?: number; // default 256 (h-64)
  borderRadius?: number; // default 0 (you can wrap with rounded container)
  placeholder?: any; // require('...') or blurhash string
};

export default function ImageCarousel({
  images,
  height = 256,
  borderRadius = 0,
  placeholder,
}: Props) {
  const data = useMemo(() => (images?.length ? images : []), [images]);
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState<{ visible: boolean; start: number }>(
    { visible: false, start: 0 },
  );
  const listRef = useRef<FlatList<string>>(null);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
    if (newIndex !== index) setIndex(newIndex);
  };

  return (
    <>
      <View
        style={{
          width: '100%',
          height,
          borderRadius,
          overflow: 'hidden',
          backgroundColor: '#e5e7eb',
        }}
      >
        <FlatList
          ref={listRef}
          data={data}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(uri, i) => uri + '_' + i}
          onScroll={onScroll}
          scrollEventThrottle={16}
          renderItem={({ item, index: i }) => (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setLightbox({ visible: true, start: i })}
            >
              <ExpoImage
                source={{ uri: item }}
                style={{ width, height }}
                contentFit="cover"
                placeholder={placeholder}
                transition={200}
                cachePolicy="memory-disk"
              />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <ExpoImage
              source={{
                uri: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=600&fit=crop',
              }}
              style={{ width, height }}
              contentFit="cover"
              transition={200}
              cachePolicy="memory-disk"
            />
          }
        />

        {/* Dots */}
        {data.length > 1 && (
          <View
            style={{
              position: 'absolute',
              bottom: 10,
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            {data.map((_, i) => (
              <View
                key={i}
                style={{
                  width: index === i ? 10 : 6,
                  height: 6,
                  borderRadius: 999,
                  backgroundColor:
                    index === i ? 'white' : 'rgba(255,255,255,0.6)',
                  marginHorizontal: 3,
                }}
              />
            ))}
          </View>
        )}
      </View>

      {/* Fullscreen lightbox */}
      <FullscreenImageModal
        visible={lightbox.visible}
        initialIndex={lightbox.start}
        images={
          data.length
            ? data
            : [
                'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=600&fit=crop',
              ]
        }
        onClose={() => setLightbox({ visible: false, start: 0 })}
      />
    </>
  );
}
