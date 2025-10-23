// components/booking/BookingBottomSheet.tsx
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { LinearGradient } from 'expo-linear-gradient';
import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';

export type Suite = {
  id: string | number;
  name: string;
  description?: string;
  price?: number;
  image?: string;
  amenities?: string[];
  capacity?: number;
};

type Guests = { adults: number; children: number };

type ProceedPayload = {
  suite: Suite;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: Guests;
  pricePerNight: number;
  subtotal: number;
};

type BookingBottomSheetProps = {
  hotelName: string;
  suites: Suite[];
  selectedSuite?: Suite | null;
  onClose?: () => void;
  onProceed?: (payload: ProceedPayload) => void;
};

/* ---------- utils ---------- */
function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function daysBetween(a: Date, b: Date) {
  const ms = startOfDay(b).getTime() - startOfDay(a).getTime();
  return Math.max(0, Math.round(ms / 86400000));
}

function ymd(d: Date) {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const dd = `${d.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function formatNGN(n: number) {
  try {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `₦${Math.round(n).toLocaleString()}`;
  }
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function buildMarkedDates(checkIn?: string, checkOut?: string) {
  if (!checkIn) return {};
  const marks: Record<string, any> = {};

  if (!checkOut) {
    marks[checkIn] = {
      selected: true,
      startingDay: true,
      endingDay: true,
      color: '#0f172a',
      textColor: 'white',
    };
    return marks;
  }

  const start = new Date(checkIn);
  const end = new Date(checkOut);
  if (end <= start) {
    marks[checkIn] = {
      selected: true,
      startingDay: true,
      endingDay: true,
      color: '#0f172a',
      textColor: 'white',
    };
    return marks;
  }

  const cur = new Date(start);
  while (cur <= end) {
    const key = ymd(cur);
    marks[key] = {
      selected: true,
      startingDay: key === checkIn,
      endingDay: key === checkOut,
      color: '#0f172a',
      textColor: 'white',
    };
    cur.setDate(cur.getDate() + 1);
  }
  return marks;
}

/* ---------- component ---------- */
const BookingBottomSheet = forwardRef<
  BottomSheetModal,
  BookingBottomSheetProps
>(function BookingBottomSheetComponent(
  { hotelName, suites, selectedSuite, onClose, onProceed },
  ref,
) {
  const snapPoints = useMemo(() => ['75%', '98%'], []);
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.8}
        {...props}
      />
    ),
    [],
  );

  // Animation values
  const slideAnim = useMemo(() => new Animated.Value(0), []);

  // Add safety checks for suites
  const safeSuites = suites || [];
  const initialSuiteId =
    selectedSuite?.id ?? (safeSuites?.[0] ? safeSuites[0].id : undefined);
  const [suiteId, setSuiteId] = useState<string | number | undefined>(
    initialSuiteId,
  );
  const currentSuite =
    safeSuites.find((s) => String(s.id) === String(suiteId)) ?? null;

  const today = startOfDay(new Date());
  const [checkInStr, setCheckInStr] = useState<string>(ymd(today));
  const [checkOutStr, setCheckOutStr] = useState<string>('');
  const [isSuiteOpen, setIsSuiteOpen] = useState(false);
  const [guests, setGuests] = useState<Guests>({ adults: 2, children: 0 });

  const effectiveCheckout =
    checkOutStr || ymd(addDays(new Date(checkInStr), 1));
  const nights = useMemo(
    () => daysBetween(new Date(checkInStr), new Date(effectiveCheckout)),
    [checkInStr, effectiveCheckout],
  );
  const pricePerNight = currentSuite?.price ?? 0;
  const subtotal = useMemo(
    () => nights * pricePerNight,
    [nights, pricePerNight],
  );

  const hasSuite = !!currentSuite;
  const hasValidDates = !!checkInStr && !!effectiveCheckout && nights > 0;
  const hasGuests = guests.adults >= 1;
  const canContinue =
    hasSuite && hasValidDates && hasGuests && pricePerNight > 0;

  // Animate suite dropdown
  const toggleSuiteDropdown = useCallback(() => {
    setIsSuiteOpen((prev) => {
      const newValue = !prev;
      Animated.timing(slideAnim, {
        toValue: newValue ? 1 : 0,
        duration: 300,
        easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
        useNativeDriver: false,
      }).start();
      return newValue;
    });
  }, [slideAnim]);

  const onDayPress = (day: DateData) => {
    const chosen = day.dateString;

    if (checkInStr && checkOutStr) {
      setCheckInStr(chosen);
      setCheckOutStr('');
      return;
    }

    if (!checkInStr) {
      setCheckInStr(chosen);
      setCheckOutStr('');
      return;
    }

    if (!checkOutStr) {
      if (chosen <= checkInStr) {
        setCheckInStr(chosen);
        setCheckOutStr('');
      } else {
        setCheckOutStr(chosen);
      }
      return;
    }
  };

  const inc = (k: keyof Guests) =>
    setGuests((g) => ({ ...g, [k]: (g[k] ?? 0) + 1 }));
  const dec = (k: keyof Guests) =>
    setGuests((g) => ({ ...g, [k]: Math.max(0, (g[k] ?? 0) - 1) }));

  const handleProceed = () => {
    if (!canContinue || !currentSuite) return;
    onProceed?.({
      suite: currentSuite,
      checkIn: checkInStr,
      checkOut: effectiveCheckout,
      nights,
      guests,
      pricePerNight,
      subtotal,
    });
  };

  const SuiteSelector = () => (
    <View className="mb-8">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-2xl font-bold text-slate-900">Suite</Text>
        {currentSuite?.capacity && (
          <Text className="text-slate-500 text-sm bg-slate-100 px-3 py-1 rounded-full">
            Up to {currentSuite.capacity} guests
          </Text>
        )}
      </View>

      <Pressable
        onPress={toggleSuiteDropdown}
        className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 4,
        }}
      >
        <View className="p-6">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-slate-900 font-semibold text-lg mb-1">
                {currentSuite?.name || 'Select a suite'}
              </Text>
              {currentSuite?.description && (
                <Text className="text-slate-500 text-sm mb-2" numberOfLines={1}>
                  {currentSuite.description}
                </Text>
              )}
              {currentSuite?.price && (
                <Text className="text-slate-900 font-bold text-xl">
                  {formatNGN(currentSuite.price)}
                  <Text className="text-slate-500 font-normal text-base">
                    /night
                  </Text>
                </Text>
              )}
            </View>
            <View
              className={`w-10 h-10 rounded-xl bg-slate-100 items-center justify-center ${
                isSuiteOpen ? 'rotate-180' : ''
              }`}
              style={{
                transform: [{ rotate: isSuiteOpen ? '180deg' : '0deg' }],
              }}
            >
              <Text className="text-slate-600 text-lg">↓</Text>
            </View>
          </View>
        </View>
      </Pressable>

      <Animated.View
        style={{
          maxHeight: slideAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 400],
          }),
          opacity: slideAnim,
        }}
        className="overflow-hidden"
      >
        <View className="mt-3 bg-white rounded-2xl border border-slate-200 overflow-hidden">
          {safeSuites.map((s, idx) => {
            const isActive = String(s.id) === String(suiteId);
            return (
              <Pressable
                key={s.id}
                onPress={() => {
                  setSuiteId(s.id);
                  toggleSuiteDropdown();
                }}
                className={`p-6 ${isActive ? 'bg-slate-50' : 'bg-white'} ${
                  idx > 0 ? 'border-t border-slate-100' : ''
                }`}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="font-semibold text-lg text-slate-900 mb-1">
                      {s.name}
                    </Text>
                    {s.description && (
                      <Text
                        className="text-slate-500 text-sm mb-2"
                        numberOfLines={2}
                      >
                        {s.description}
                      </Text>
                    )}
                    {s.capacity && (
                      <Text className="text-slate-400 text-xs">
                        Up to {s.capacity} guests
                      </Text>
                    )}
                  </View>
                  {s.price && (
                    <Text className="font-bold text-xl text-slate-900">
                      {formatNGN(s.price)}
                    </Text>
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
      </Animated.View>
    </View>
  );

  const DateSelector = () => (
    <View className="mb-8">
      <Text className="text-2xl font-bold text-slate-900 mb-4">Dates</Text>

      <View
        className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 4,
        }}
      >
        {/* Date Summary Header */}
        <View className="px-6 py-5 bg-slate-50 border-b border-slate-100">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-slate-500 text-sm font-medium mb-1">
                Check-in
              </Text>
              <Text className="text-slate-900 font-bold text-lg">
                {formatDate(checkInStr)}
              </Text>
            </View>

            <View className="items-center px-4">
              <View className="w-12 h-px bg-slate-300 mb-1" />
              <Text className="text-slate-600 text-xs font-semibold">
                {nights} {nights === 1 ? 'NIGHT' : 'NIGHTS'}
              </Text>
            </View>

            <View className="flex-1 items-end">
              <Text className="text-slate-500 text-sm font-medium mb-1">
                Check-out
              </Text>
              <Text className="text-slate-900 font-bold text-lg">
                {checkOutStr ? formatDate(checkOutStr) : 'Select'}
              </Text>
            </View>
          </View>
        </View>

        {/* Calendar */}
        <Calendar
          style={{ backgroundColor: 'transparent' }}
          initialDate={checkInStr}
          minDate={ymd(new Date())}
          onDayPress={onDayPress}
          markedDates={buildMarkedDates(checkInStr, checkOutStr)}
          markingType="period"
          hideExtraDays
          theme={{
            backgroundColor: 'transparent',
            calendarBackground: 'transparent',
            textSectionTitleColor: '#64748b',
            monthTextColor: '#0f172a',
            textMonthFontWeight: '700',
            textMonthFontSize: 18,
            textDayFontWeight: '500',
            textDayFontSize: 16,
            todayTextColor: '#0f172a',
            arrowColor: '#0f172a',
            selectedDayBackgroundColor: '#0f172a',
            selectedDayTextColor: '#ffffff',
            dayTextColor: '#334155',
            textDisabledColor: '#cbd5e1',
          }}
        />
      </View>
    </View>
  );

  const GuestSelector = () => (
    <View className="mb-12">
      <Text className="text-2xl font-bold text-slate-900 mb-4">Guests</Text>

      <View
        className="bg-white rounded-2xl border border-slate-200"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 4,
        }}
      >
        {(['adults', 'children'] as (keyof Guests)[]).map((k, idx) => (
          <View
            key={k}
            className={`p-6 flex-row items-center justify-between ${
              idx > 0 ? 'border-t border-slate-100' : ''
            }`}
          >
            <View className="flex-1">
              <Text className="text-slate-900 font-semibold text-lg capitalize mb-1">
                {k}
              </Text>
              <Text className="text-slate-500 text-sm">
                {k === 'adults' ? '18+ years' : '0–17 years'}
              </Text>
            </View>

            <View className="flex-row items-center bg-slate-50 rounded-2xl p-2">
              <TouchableOpacity
                className="w-12 h-12 rounded-xl bg-white items-center justify-center border border-slate-200"
                onPress={() => dec(k)}
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <Text className="text-slate-600 text-xl font-bold">−</Text>
              </TouchableOpacity>

              <Text className="w-16 text-center text-slate-900 font-bold text-xl">
                {guests[k]}
              </Text>

              <TouchableOpacity
                className="w-12 h-12 rounded-xl bg-white items-center justify-center border border-slate-200"
                onPress={() => inc(k)}
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <Text className="text-slate-600 text-xl font-bold">+</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      index={1}
      backdropComponent={renderBackdrop}
      enableContentPanningGesture
      enableHandlePanningGesture
      handleStyle={{ backgroundColor: 'white' }}
      handleIndicatorStyle={{
        backgroundColor: '#e2e8f0',
        width: 48,
        height: 4,
      }}
      backgroundStyle={{ backgroundColor: 'white' }}
      onChange={(i) => {
        if (i === -1 && onClose) onClose();
      }}
    >
      {/* Header */}
      <View className="px-6 pt-4 pb-2 bg-white border-b border-slate-100">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-3xl font-black text-slate-900 mb-1">
              Book Your Stay
            </Text>
            <Text className="text-slate-600 text-lg">{hotelName}</Text>
          </View>
          <TouchableOpacity
            onPress={onClose}
            className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center"
          >
            <Text className="text-slate-600 text-lg font-bold">×</Text>
          </TouchableOpacity>
        </View>
      </View>

      <BottomSheetScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 24,
          paddingBottom: 140,
          backgroundColor: '#f8fafc',
        }}
      >
        <SuiteSelector />
        <DateSelector />
        <GuestSelector />
      </BottomSheetScrollView>

      {/* Floating Bottom Actions */}
      <LinearGradient
        colors={[
          'rgba(248, 250, 252, 0)',
          'rgba(248, 250, 252, 0.9)',
          'rgba(248, 250, 252, 1)',
        ]}
        className="absolute bottom-0 left-0 right-0"
      >
        <View className="px-6 pt-4 pb-8">
          {/* Price Summary */}
          <View
            className="bg-white rounded-2xl p-6 mb-4 border border-slate-200"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
              elevation: 4,
            }}
          >
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-slate-600 text-base">
                {nights} night{nights !== 1 ? 's' : ''} ×{' '}
                {formatNGN(pricePerNight)}
              </Text>
              <Text className="text-slate-900 font-semibold text-lg">
                {formatNGN(subtotal)}
              </Text>
            </View>
            <View className="h-px bg-slate-200 my-3" />
            <View className="flex-row justify-between items-center">
              <Text className="text-slate-900 font-bold text-xl">Total</Text>
              <Text className="text-slate-900 font-black text-2xl">
                {formatNGN(subtotal)}
              </Text>
            </View>
          </View>

          {/* Validation Messages */}
          {(!hasSuite || !hasGuests) && (
            <View className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
              <Text className="text-red-700 font-medium text-center">
                {!hasSuite && 'Please select a suite. '}
                {!hasGuests && 'At least 1 adult is required.'}
              </Text>
            </View>
          )}

          {/* Action Buttons */}
          <View className="flex-row gap-4">
            <TouchableOpacity
              className="flex-1 bg-white py-4 rounded-2xl border border-slate-200"
              onPress={onClose}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <Text className="text-center text-slate-700 font-semibold text-lg">
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={!canContinue}
              onPress={handleProceed}
              className="flex-[2]"
            >
              <LinearGradient
                colors={
                  canContinue ? ['#0f172a', '#334155'] : ['#e2e8f0', '#cbd5e1']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="py-4 rounded-2xl"
                style={{
                  shadowColor: canContinue ? '#0f172a' : 'transparent',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: canContinue ? 0.3 : 0,
                  shadowRadius: 8,
                  elevation: canContinue ? 6 : 0,
                }}
              >
                <Text className="text-center text-white font-bold text-lg">
                  Continue to Payment
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </BottomSheetModal>
  );
});

BookingBottomSheet.displayName = 'BookingBottomSheet';
export default BookingBottomSheet;
