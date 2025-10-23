// components/media/FullscreenImageModal.tsx
import { Image as ExpoImage } from 'expo-image';
import { X } from 'lucide-react-native';
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Dimensions,
  FlatList,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

type Props = {
  visible: boolean;
  images: string[];
  initialIndex?: number;
  changeModal?: Dispatch<SetStateAction<number>>;
  onClose: () => void;
};

export default function FullscreenImageModal({
  visible,
  images,
  initialIndex = 0,
  onClose,
  changeModal,
}: Props) {
  const listRef = useRef<FlatList<string>>(null);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // When opened, jump to initialIndex and sync counter
  useEffect(() => {
    if (visible && listRef.current && images?.length) {
      // Set first so the counter is correct immediately
      setCurrentIndex(initialIndex);
      // Then scroll on next frame to avoid race conditions
      requestAnimationFrame(() => {
        try {
          listRef.current?.scrollToIndex({
            index: initialIndex,
            animated: false,
          });
        } catch {
          // no-op if index out of range momentarily
        }
      });
    }
  }, [visible, initialIndex, images?.length]);

  const keyExtractor = useCallback(
    (uri: string, i: number) => uri + '_' + i,
    [],
  );

  const renderItem = useCallback(({ item }: { item: string }) => {
    return (
      <View
        style={{
          width,
          height,
          backgroundColor: 'black',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ExpoImage
          source={{ uri: item }}
          style={{ width, height }}
          contentFit="contain"
          transition={200}
          cachePolicy="memory-disk"
        />
      </View>
    );
  }, []);

  // Update index while swiping
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    if (i !== currentIndex) setCurrentIndex(i);
  };

  // Also ensure index is correct after momentum finishes (Android reliability)
  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    if (i !== currentIndex) setCurrentIndex(i);
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      transparent
    >
      <View style={{ flex: 1, backgroundColor: 'black' }}>
        <TouchableOpacity
          onPress={onClose}
          style={{
            position: 'absolute',
            top: 50,
            right: 20,
            zIndex: 10,
            backgroundColor: 'rgba(255,255,255,0.15)',
            padding: 8,
            borderRadius: 999,
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <X size={22} color="#fff" />
        </TouchableOpacity>

        <FlatList
          ref={listRef}
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          // Keep scroll index in sync
          onScroll={onScroll}
          onMomentumScrollEnd={onMomentumScrollEnd}
          scrollEventThrottle={16}
          // Prevent accidental vertical scroll inside modal
          bounces={false}
        />

        <View
          style={{
            position: 'absolute',
            bottom: 30,
            left: 0,
            right: 0,
            alignItems: 'center',
          }}
        >
          <Text
            style={{ color: '#fff', fontWeight: '600' }}
            className="font-regular"
          >
            {Math.min(images.length, Math.max(1, currentIndex + 1))} /{' '}
            {images.length}
          </Text>
        </View>
      </View>
    </Modal>
  );
}
