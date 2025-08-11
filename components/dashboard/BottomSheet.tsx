// components/BottomSheet/BottomSheet.tsx
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { StyleSheet, Text } from 'react-native';

export type BottomRef = BottomSheetModal;

const BottomSheet = forwardRef<BottomRef>((_, ref) => {
  const innerRef = useRef<BottomSheetModal>(null);

  // Expose internal methods to the parent component
  useImperativeHandle(ref, () => innerRef.current!, []);

  const snapPoints = useMemo(() => ['25%', '50%'], []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={innerRef}
      index={1}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
    >
      <BottomSheetView style={styles.contentContainer}>
        <Text style={styles.sheetText}>Welcome to Roomly 🎉</Text>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

BottomSheet.displayName = 'BottomSheet';

export default BottomSheet;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
