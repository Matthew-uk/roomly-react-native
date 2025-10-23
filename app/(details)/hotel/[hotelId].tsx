// app/(main)/hotels/[hotelId].tsx
import BookingBottomSheet from '@/components/booking/BookingBottomSheet';
import MapPreview from '@/components/dashboard/MapPreview';
import ImageCarousel from '@/components/media/ImageCarousel';
import HotelDetailsSkeleton from '@/components/skeletons/HotelDetailsSkeleton';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import axios from 'axios';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import {
  Bath,
  BedDouble,
  ChevronLeft,
  MessageCircle,
  Navigation,
  Phone,
  Ruler,
} from 'lucide-react-native';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  BuildingStorefrontIcon,
  HeartIcon,
  MapPinIcon,
  ShareIcon,
  WifiIcon,
} from 'react-native-heroicons/outline';
import {
  HeartIcon as HeartSolidIcon,
  StarIcon as StarSolidIcon,
} from 'react-native-heroicons/solid';
import { SafeAreaView } from 'react-native-safe-area-context';

const API_BASE = 'https://roomy-backend-duq2.onrender.com';

type Suite = {
  id: string | number;
  name: string;
  description?: string;
  price?: number;
  image?: string;
};

type Agent = {
  name: string;
  avatar?: string;
  role?: string;
  phone?: string;
};

type Hotel = {
  id: string;
  name: string;
  description?: string;
  images?: string[];
  rating?: number; // 0..5
  address?: string;
  reviewsCount?: number;
  amenities?: string[];
  suites?: Suite[];
  latitude: number;
  longitude: number;
  minPrice: number;
  maxPrice: number;

  // ⭐️ new optional fields (used only if present; safe fallbacks otherwise)
  beds?: number;
  baths?: number;
  sqft?: number;
  agent?: Agent;
};

export default function HotelDetails() {
  const { hotelId } = useLocalSearchParams<{ hotelId: string }>();

  const [data, setData] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  // bottom sheet
  const bookingRef = useRef<BottomSheetModal>(null);
  const [selectedSuite, setSelectedSuite] = useState<Suite | null>(null);

  const openBooking = useCallback((suite?: Suite | null) => {
    setSelectedSuite(suite ?? null);
    bookingRef.current?.present();
  }, []);
  const closeBooking = useCallback(() => bookingRef.current?.dismiss(), []);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        setLoading(true);
        setError(null);
        const token = await SecureStore.getItemAsync('token');
        const res = await axios.get<Hotel>(
          `${API_BASE}/api/hotels/${hotelId}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          },
        );
        console.log(res.data);
        if (!cancelled) setData(res.data);
      } catch (e: any) {
        if (!cancelled)
          setError(
            e?.response?.data?.message ?? e?.message ?? 'Failed to fetch',
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [hotelId]);

  const facilities = useMemo(() => {
    const fallback = [
      { icon: WifiIcon, label: 'Free Wi-Fi' },
      { icon: BuildingStorefrontIcon, label: 'Restaurant' },
      { icon: WifiIcon, label: 'Gym' },
      { icon: BuildingStorefrontIcon, label: 'A/C' },
      { icon: WifiIcon, label: 'Spa' },
      { icon: BuildingStorefrontIcon, label: 'Pet Friendly' },
      { icon: WifiIcon, label: 'Pool' },
      { icon: BuildingStorefrontIcon, label: 'Parking' },
    ];
    if (!data?.amenities?.length) return fallback;

    const map: Record<string, { icon: any; label: string }> = {
      wifi: { icon: WifiIcon, label: 'Free Wi-Fi' },
      restaurant: { icon: BuildingStorefrontIcon, label: 'Restaurant' },
      gym: { icon: WifiIcon, label: 'Gym' },
      ac: { icon: BuildingStorefrontIcon, label: 'A/C' },
      spa: { icon: WifiIcon, label: 'Spa' },
      pet: { icon: BuildingStorefrontIcon, label: 'Pet Friendly' },
      pool: { icon: WifiIcon, label: 'Pool' },
      parking: { icon: BuildingStorefrontIcon, label: 'Parking' },
    };
    return data.amenities
      .map((a) => map[a.toLowerCase()])
      .filter(Boolean)
      .slice(0, 8);
  }, [data?.amenities]);

  const suites: Suite[] =
    data?.suites && data.suites.length
      ? data.suites
      : [
          {
            id: 1,
            name: 'Presidential',
            description: 'Ultimate luxury with a city view',
            price: 899,
            image:
              'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop',
          },
          {
            id: 2,
            name: 'Executive',
            description: 'Ideal for business travellers',
            price: 599,
            image:
              'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop',
          },
        ];

  const minNightPrice = useMemo(() => {
    const p = suites
      .map((s) => s.price ?? 0)
      .filter((n) => Number.isFinite(n) && n > 0);
    return p.length ? Math.min(...p) : 0;
  }, [suites]);

  if (loading) return <HotelDetailsSkeleton />;

  if (error || !data) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="p-4">
          <Text className="text-red-600 font-medium">
            Couldn’t load hotel: {error ?? 'Unknown error'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const hero =
    data.images?.[0] ??
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=800&fit=crop';

  // small info pills (like the reference)
  const infoPills = [
    { icon: BedDouble, label: `${data.beds ?? 8} Beds` },
    { icon: Bath, label: `${data.baths ?? 3} Bath` },
    { icon: Ruler, label: `${data.sqft ?? 2000} sqft` },
  ];

  return (
    <BottomSheetModalProvider>
      <View className="flex-1 bg-white">
        <Stack.Screen options={{ title: data.name }} />
        <StatusBar barStyle="dark-content" backgroundColor="white" />

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          // leave room for sticky CTA
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {/* HERO */}
          <View className="relative">
            <ImageCarousel
              images={data.images}
              height={300}
              borderRadius={0}
              placeholder={require('@/assets/images/load-1110.gif')}
            />

            {/* top-left back */}
            <View className="absolute top-16 left-4 flex flex-row gap-3">
              <TouchableOpacity
                className="bg-white/75 p-2 rounded-full shadow-sm"
                onPress={() => router.back()}
              >
                <ChevronLeft size={20} color="#111827" />
              </TouchableOpacity>
            </View>

            {/* top-right actions */}
            <View className="absolute top-16 right-4 flex flex-row gap-3">
              <TouchableOpacity className="bg-white/75 p-2 rounded-full shadow-sm">
                <ShareIcon size={20} color="#111827" />
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-white/75 p-2 rounded-full shadow-sm"
                onPress={() => setIsFavorite((x) => !x)}
              >
                {isFavorite ? (
                  <HeartSolidIcon size={20} color="#636AE8" />
                ) : (
                  <HeartIcon size={20} color="#111827" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* HEADER / TITLE */}
          <View className="px-4 pt-4">
            <Text className="text-2xl font-bold text-gray-900">
              {data.name}
            </Text>

            {/* rating + reviews */}
            <View className="flex-row items-center mt-2">
              <View className="flex-row items-center mr-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarSolidIcon
                    key={i}
                    size={16}
                    color={
                      i < Math.round(data.rating ?? 0) ? '#f59e0b' : '#e5e7eb'
                    }
                  />
                ))}
              </View>
              {!!data.reviewsCount && (
                <Text className="text-xs text-gray-600">
                  {data.rating?.toFixed(1) ?? '4.8'} ({data.reviewsCount}{' '}
                  reviews)
                </Text>
              )}
            </View>

            {/* info pills */}
            <View className="flex-row gap-2 mt-3">
              {infoPills.map((p, idx) => (
                <View
                  key={idx}
                  className="flex-row items-center bg-gray-100 px-3 py-1.5 rounded-full"
                >
                  <p.icon size={16} color="#111827" />
                  <Text className="ml-1.5 text-xs font-medium text-gray-800">
                    {p.label}
                  </Text>
                </View>
              ))}
            </View>

            {/* address */}
            {!!data.address && (
              <View className="flex-row items-center mt-3">
                <MapPinIcon size={16} color="#6b7280" />
                <Text className="ml-1 text-sm text-gray-600 font-medium">
                  {data.address}
                </Text>
              </View>
            )}

            {/* quick actions */}
            <View className="flex-row gap-8 mt-4">
              <TouchableOpacity
                className="bg-primary/10 px-3 py-2 rounded-xl"
                onPress={() => openBooking(null)}
              >
                <Text className="text-blue-700 font-medium">Book Now</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-orange-500/10 px-3 py-2 rounded-xl flex-row items-center"
                onPress={() =>
                  router.push({
                    pathname: '/(modal)/maps',
                    params: {
                      lat: String(data.latitude),
                      lon: String(data.longitude),
                    },
                  })
                }
              >
                <Navigation size={18} color={'#fb923c'} />
                <Text className="ml-1 text-orange-600 font-medium">
                  View on Map
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* AGENT */}
          {(data.agent?.name ?? true) && (
            <View className="px-4 mt-6">
              <Text className="text-base font-medium text-gray-900 mb-3">
                Hotel
              </Text>
              <View className="flex-row items-center justify-between bg-white border border-gray-200 rounded-2xl p-3 shadow-xs">
                <View className="flex-row items-center">
                  <Image
                    source={{
                      uri:
                        data.agent?.avatar ??
                        'https://i.pravatar.cc/100?img=12',
                    }}
                    className="w-10 h-10 rounded-full"
                  />
                  <View className="ml-3">
                    <Text className="text-gray-900 font-medium">
                      {data.agent?.name ?? 'Natasya Wilodra'}
                    </Text>
                    <Text className="text-xs text-gray-500">
                      {data.agent?.role ?? 'Owner'}
                    </Text>
                  </View>
                </View>

                <View className="flex-row gap-2">
                  <TouchableOpacity className="bg-gray-100 p-2 rounded-full">
                    <Phone size={18} color="#111827" />
                  </TouchableOpacity>
                  <TouchableOpacity className="bg-gray-100 p-2 rounded-full">
                    <MessageCircle size={18} color="#111827" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* OVERVIEW */}
          {(data.description?.length ?? 0) > 0 && (
            <View className="px-4 mt-6">
              <Text className="text-base font-medium text-gray-900 mb-2">
                Overview
              </Text>
              <Text className="text-gray-600 leading-6 font-regular text-sm">
                {data.description}
              </Text>
            </View>
          )}

          {/* FACILITIES */}
          {!!facilities.length && (
            <View className="px-4 mt-6">
              <Text className="text-base font-medium text-gray-900 mb-3">
                Facilities
              </Text>
              <View className="flex-row flex-wrap">
                {facilities.map((facility, idx) => (
                  <View key={idx} className="w-1/4 items-center mb-5">
                    <View className="bg-gray-50 p-3 rounded-2xl mb-2 border border-gray-100">
                      <facility.icon size={22} color="#374151" />
                    </View>
                    <Text className="text-[11px] text-gray-600 text-center font-regular">
                      {facility.label}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* GALLERY */}
          {!!data.images?.length && (
            <View className="px-4 mt-2">
              <Text className="text-base font-medium text-gray-900 mb-3">
                Gallery
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {(data.images ?? []).slice(0, 6).map((uri, i) => (
                  <Image
                    key={uri + i}
                    source={{ uri }}
                    className="w-28 h-24 mr-1 rounded-xl"
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {/* LOCATION */}
          <View className="px-4 mt-6">
            <Text className="text-base font-medium text-gray-900 mb-3">
              Location
            </Text>

            <View className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-200">
              {/* Simple map preview card; press to open your maps modal */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() =>
                  router.push({
                    pathname: '/(modal)/maps',
                    params: {
                      lat: String(data.latitude),
                      lon: String(data.longitude),
                    },
                  })
                }
              >
                {/* <View className="h-44 w-full items-center justify-center"> */}
                {/* lightweight placeholder look */}
                <MapPreview
                  lat={data.latitude}
                  lon={data.longitude}
                  label={data.name}
                  onPress={() =>
                    router.push({
                      pathname: '/(modal)/maps',
                      params: {
                        lat: String(data.latitude),
                        lon: String(data.longitude),
                      },
                    })
                  }
                />
                {/* </View> */}
              </TouchableOpacity>

              {!!data.address && (
                <View className="px-3 py-3 border-t border-gray-200 flex-row items-center">
                  <MapPinIcon size={18} color="#6b7280" />
                  <Text className="ml-2 text-sm text-gray-700 flex-1 font-regular">
                    {data.address}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* REVIEW (lightweight, keeps structure flexible) */}
          <View className="px-4 mt-6">
            <View className="flex-row items-center justify-between">
              <Text className="text-base font-medium text-gray-900">
                {data.rating?.toFixed(1) ?? '4.8'} ({data.reviewsCount ?? 1275}{' '}
                reviews)
              </Text>
              <TouchableOpacity>
                <Text className="text-primarbg-primary font-medium font-regular">
                  See All
                </Text>
              </TouchableOpacity>
            </View>

            <View className="mt-3 bg-white border border-gray-200 rounded-2xl p-3">
              <View className="flex-row items-center">
                <Image
                  source={{ uri: 'https://i.pravatar.cc/100?img=5' }}
                  className="w-9 h-9 rounded-full"
                />
                <View className="ml-3">
                  <Text className="text-gray-900 font-medium text-sm font-regular">
                    Charlotte Hanlin
                  </Text>
                  <View className="flex-row mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarSolidIcon
                        key={i}
                        size={12}
                        color={i < 5 ? '#f59e0b' : '#e5e7eb'}
                      />
                    ))}
                  </View>
                </View>
              </View>
              <Text className="mt-3 text-gray-600 text-sm font-regular">
                The apartment is very clean and modern. I really like the
                interior design. Looks like I’ll feel at home. 🧡
              </Text>
              <View className="flex-row items-center mt-3">
                <Text className="text-xs text-gray-500 mr-3 font-regular">
                  938
                </Text>
                <Text className="text-xs text-gray-400 font-regular">
                  • 6 days ago
                </Text>
              </View>
            </View>
          </View>

          {/* SUITES */}
          {!!suites.length && (
            <View className="px-4 mt-8">
              <Text className="text-base font-medium text-gray-900 mb-3">
                Available Suites
              </Text>

              <View className="flex-row flex-wrap justify-between">
                {suites.map((suite) => (
                  <View
                    key={suite.id}
                    className="w-[48%] mb-4 bg-white rounded-2xl p-2 border border-gray-200 shadow-sm"
                  >
                    {!!suite.image && (
                      <Image
                        source={{ uri: suite.image }}
                        className="w-full h-32 rounded-xl mb-2"
                        resizeMode="cover"
                      />
                    )}
                    <Text className="font-medium text-gray-900 text-sm font-regular">
                      {suite.name}
                    </Text>
                    {!!suite.description && (
                      <Text
                        className="text-xs text-gray-600 mt-1 font-regular"
                        numberOfLines={2}
                      >
                        {suite.description}
                      </Text>
                    )}
                    {!!suite.price && (
                      <Text className="text-primarbg-primary font-medium text-sm mt-2 font-regular">
                        ₦{suite.price.toLocaleString()}
                        <Text className="text-gray-500"> / night</Text>
                      </Text>
                    )}
                    <TouchableOpacity
                      className="bg-primary py-2 px-3 rounded-lg mt-2"
                      onPress={() => openBooking(suite)}
                    >
                      <Text className="text-white text-center text-sm font-medium font-regular">
                        Book Now
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        {/* STICKY BOTTOM BAR (price + CTA) */}
        <View className="absolute border-2 border-primary border-b-transparent left-0 right-0 bottom-0 bg-white px-4 pt-3 pb-4 rounded-t-3xl h-[80px]">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-[11px] text-gray-500 font-regular">
                PRICE
              </Text>
              <Text className="text-base font-bold text-primary">
                {data.minPrice > 0
                  ? `₦${data.minPrice.toLocaleString()} - ₦${data.maxPrice.toLocaleString()}`
                  : '-'}
                <Text className="text-gray-500"> / night</Text>
              </Text>
            </View>
            <TouchableOpacity
              className="bg-primary px-6 py-3 rounded-full"
              onPress={() => openBooking(null)}
            >
              <Text className="text-white font-medium">Book Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* BOTTOM SHEET */}
        <BookingBottomSheet
          ref={bookingRef}
          hotelName={data.name}
          suites={suites}
          selectedSuite={selectedSuite ?? undefined}
          onClose={closeBooking}
          onProceed={(payload) => {
            console.log('Proceed booking:', payload);
            closeBooking();
          }}
        />
      </View>
    </BottomSheetModalProvider>
  );
}
