// components/booking/BookingBottomSheet.tsx
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';

export type Suite = {
  id: string | number;
  name: string;
  description?: string;
  price?: number; // per night (NGN)
  image?: string;
};

type Guests = { adults: number; children: number };

type ProceedPayload = {
  suite: Suite;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  nights: number;
  guests: Guests;
  pricePerNight: number;
  subtotal: number;
  promoCode?: string;
  notes?: string;
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

/** Build markings for react-native-calendars with markingType="period" */
function buildMarkedDates(checkIn?: string, checkOut?: string) {
  if (!checkIn) return {};
  const marks: Record<string, any> = {};

  // If no checkout selected yet, show a single selected day
  if (!checkOut) {
    marks[checkIn] = {
      selected: true,
      startingDay: true,
      endingDay: true,
      color: '#2563eb',
      textColor: 'white',
    };
    return marks;
  }

  // Ensure checkOut > checkIn for a period
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  if (end <= start) {
    marks[checkIn] = {
      selected: true,
      startingDay: true,
      endingDay: true,
      color: '#2563eb',
      textColor: 'white',
    };
    return marks;
  }

  // Inclusive range
  const cur = new Date(start);
  while (cur <= end) {
    const key = ymd(cur);
    marks[key] = {
      selected: true,
      startingDay: key === checkIn,
      endingDay: key === checkOut,
      color: '#2563eb',
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
  const snapPoints = useMemo(() => ['65%', '92%'], []);
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

  // ----- state
  const initialSuiteId =
    selectedSuite?.id ?? (suites?.[0] ? suites[0].id : undefined);
  const [suiteId, setSuiteId] = useState<string | number | undefined>(
    initialSuiteId,
  );
  const currentSuite =
    suites.find((s) => String(s.id) === String(suiteId)) ?? null;

  const today = startOfDay(new Date());
  const [checkInStr, setCheckInStr] = useState<string>(ymd(today));
  // IMPORTANT: keep checkout empty until user picks it
  const [checkOutStr, setCheckOutStr] = useState<string>('');

  const [isSuiteOpen, setIsSuiteOpen] = useState(false);
  const [guests, setGuests] = useState<Guests>({ adults: 2, children: 0 });
  const [promoCode, setPromoCode] = useState('');
  const [notes, setNotes] = useState('');

  // When checkout is empty, show 1 night in the summary as a helpful default
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

  // ----- handlers

  /** Proper two-tap range selection:
   *  1st tap -> set check-in, clear check-out
   *  2nd tap -> if > check-in, set check-out; else move check-in and keep waiting
   *  Any tap when both set -> start a new range
   */
  const onDayPress = (day: DateData) => {
    const chosen = day.dateString;

    // Start new selection if we already had a full range
    if (checkInStr && checkOutStr) {
      setCheckInStr(chosen);
      setCheckOutStr('');
      return;
    }

    // If no start yet (edge case), set start
    if (!checkInStr) {
      setCheckInStr(chosen);
      setCheckOutStr('');
      return;
    }

    // We have start but no end: decide end or adjust start
    if (!checkOutStr) {
      if (chosen <= checkInStr) {
        // Move the start earlier (or same day), still waiting for end
        setCheckInStr(chosen);
        setCheckOutStr('');
      } else {
        // Valid end
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
      checkOut: effectiveCheckout, // if user didn't tap an end, we fallback to +1 day
      nights,
      guests,
      pricePerNight,
      subtotal,
      promoCode: promoCode.trim() || undefined,
      notes: notes.trim() || undefined,
    });
  };

  // ----- UI parts
  const SuiteDropdown = () => (
    <View className="mb-4">
      <Text className="text-gray-800 font-medium mb-1">Suite</Text>
      <Pressable
        onPress={() => setIsSuiteOpen((p) => !p)}
        className="h-12 rounded-2xl border border-gray-200 bg-white px-4 flex-row items-center justify-between"
      >
        <Text className="text-gray-900 font-medium" numberOfLines={1}>
          {currentSuite
            ? `${currentSuite.name}${
                currentSuite.price
                  ? ` — ${formatNGN(currentSuite.price)}/night`
                  : ''
              }`
            : 'Select a suite'}
        </Text>
        <Text className="text-gray-500">{isSuiteOpen ? '▲' : '▼'}</Text>
      </Pressable>

      {isSuiteOpen && (
        <View className="mt-2 rounded-2xl border border-gray-200 bg-white overflow-hidden">
          {suites.map((s, idx) => {
            const isActive = String(s.id) === String(suiteId);
            return (
              <Pressable
                key={s.id}
                onPress={() => {
                  setSuiteId(s.id);
                  setIsSuiteOpen(false);
                }}
                className={`px-4 py-3 ${isActive ? 'bg-primary' : 'bg-white'}`}
              >
                <Text
                  className={`text-sm ${
                    isActive ? 'text-primary font-medium' : 'text-gray-900'
                  }`}
                >
                  {s.name} {s.price ? `• ${formatNGN(s.price)}/night` : ''}
                </Text>
                {!!s.description && (
                  <Text
                    className="text-xs text-gray-500 mt-1"
                    numberOfLines={2}
                  >
                    {s.description}
                  </Text>
                )}
                {idx < suites.length - 1 && (
                  <View className="h-px bg-gray-100 mt-3 -mb-0.5" />
                )}
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );

  const DatesCard = () => (
    <View className="mb-4 rounded-2xl border border-gray-200 bg-white">
      <View className="px-4 pt-3 pb-2 border-b border-gray-100">
        <Text className="text-gray-800 font-medium">Select dates</Text>
        <Text className="text-gray-500 mt-0.5 font-regular">
          {checkInStr} → {checkOutStr ? checkOutStr : 'select checkout'} (
          {nights} night{nights === 1 ? '' : 's'})
        </Text>
      </View>

      <Calendar
        style={{ borderRadius: 16 }}
        initialDate={checkInStr}
        minDate={ymd(new Date())}
        onDayPress={onDayPress}
        markedDates={buildMarkedDates(checkInStr, checkOutStr)}
        markingType="period"
        hideExtraDays
        theme={{
          backgroundColor: 'transparent',
          calendarBackground: 'transparent',
          textSectionTitleColor: '#6b7280',
          monthTextColor: '#111827',
          textMonthFontWeight: '500',
          textDayFontWeight: '500',
          todayTextColor: '#2563eb',
          arrowColor: '#111827',
          selectedDayBackgroundColor: '#636AE8',
          selectedDayTextColor: '#ffffff',
          dayTextColor: '#111827',
          textDayFontFamily: 'Urbanist-Regular',
          textMonthFontFamily: 'Urbanist-Regular',
          textMonthFontSize: 14,
          textDayFontSize: 14,
        }}
        className="font-regular"
      />
    </View>
  );

  const GuestsCard = () => (
    <View className="mb-4 rounded-2xl border border-gray-200 bg-white p-4">
      <Text className="text-gray-800 font-medium mb-2">Guests</Text>

      {(['adults', 'children'] as (keyof Guests)[]).map((k) => (
        <View key={k} className="flex-row items-center justify-between mb-2">
          <View>
            <Text className="text-gray-900 capitalize font-medium">{k}</Text>
            <Text className="text-gray-500 text-xs">
              {k === 'adults' ? '18+ years' : '0–17 years'}
            </Text>
          </View>
          <View className="flex-row items-center">
            <TouchableOpacity
              className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center mr-2"
              onPress={() => dec(k)}
            >
              <Text className="text-lg">−</Text>
            </TouchableOpacity>
            <Text className="w-8 text-center text-gray-900">{guests[k]}</Text>
            <TouchableOpacity
              className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center ml-2"
              onPress={() => inc(k)}
            >
              <Text className="text-lg">+</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
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
      onChange={(i) => {
        if (i === -1 && onClose) onClose();
      }}
    >
      <BottomSheetView style={{ padding: 16, paddingTop: 0, paddingBottom: 0 }}>
        {/* Header */}
        <View className="mb-1">
          <Text className="text-[20px] font-bold text-gray-900">
            Booking {hotelName}
          </Text>
        </View>

        {/* Suite */}
        <SuiteDropdown />

        {/* Dates */}
        <DatesCard />

        {/* Guests */}
        <GuestsCard />

        {/* Extras */}
        {/* <View className="mb-3">
          <Text className="text-gray-800 font-medium mb-1">
            Promo Code (optional)
          </Text>
          <TextInput
            value={promoCode}
            onChangeText={setPromoCode}
            placeholder="Enter promo code"
            className="h-12 rounded-2xl border border-gray-200 bg-white px-4 text-gray-900"
            placeholderTextColor="#9ca3af"
          />
        </View> */}

        {/* <View style={{ marginBottom: 96 }}>
          <Text className="text-gray-800 font-medium mb-1">
            Notes (optional)
          </Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Any special requests?"
            className="min-h-12 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900"
            placeholderTextColor="#9ca3af"
            multiline
          />
        </View> */}

        {/* Sticky footer summary */}
        <View className="px-4 pb-4">
          <View className="bg-white border-gray-200 rounded-t-2xl pb-3">
            <View className="flex-row justify-between mb-1">
              <Text className="text-gray-700 font-regular">Nights</Text>
              <Text className="text-gray-900 font-medium">{nights}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-700 font-regular">
                Price per night
              </Text>
              <Text className="text-gray-900 font-medium">
                {formatNGN(pricePerNight)}
              </Text>
            </View>
            <View className="h-px bg-gray-200 my-2" />
            <View className="flex-row justify-between mb-3">
              <Text className="text-gray-900 font-medium font-regular">
                Total
              </Text>
              <Text className="text-primary font-bold">
                {formatNGN(subtotal)}
              </Text>
            </View>

            {/* Validation hints */}
            {!hasSuite && (
              <Text className="text-red-600 mb-2 font-regular">
                Please select a suite.
              </Text>
            )}
            {!hasGuests && (
              <Text className="text-red-600 mb-2 font-regular">
                At least 1 adult is required.
              </Text>
            )}

            <View className="flex-row gap-10">
              <TouchableOpacity
                className="flex-1 bg-gray-100 py-3 rounded-2xl"
                onPress={onClose}
              >
                <Text className="text-center text-gray-900 font-medium">
                  Close
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={!canContinue}
                className={`flex-1 py-3 rounded-2xl ${
                  canContinue ? 'bg-primary' : 'bg-primary'
                }`}
                onPress={handleProceed}
              >
                <Text className="text-center text-white font-medium">
                  Continue
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

BookingBottomSheet.displayName = 'BookingBottomSheet';
export default BookingBottomSheet;
