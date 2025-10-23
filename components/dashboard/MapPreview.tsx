// components/map/MapPreview.tsx
import MapboxGL from '@rnmapbox/maps';
import { MapPin } from 'lucide-react-native';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

type Props = {
  lat: number;
  lon: number;
  onPress: () => void;
  zoom?: number;
  height?: number;
  label?: string;
  subtitle?: string;
  showCard?: boolean; // toggles mini info card above the dot
};

export default function MapPreview({
  lat,
  lon,
  onPress,
  zoom = 14,
  height = 176,
  label,
  subtitle,
  showCard = true,
}: Props) {
  const center: [number, number] = [lon, lat];

  return (
    <View className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-200">
      <View style={{ height, width: '100%' }}>
        <MapboxGL.MapView
          style={{ flex: 1 }}
          styleURL={MapboxGL.StyleURL.Street}
          rotateEnabled={false}
          pitchEnabled={false}
          zoomEnabled={false}
          scrollEnabled={false}
          compassEnabled={false}
          logoEnabled={false} // ⚠️ enable logo/attribution in production to meet Mapbox terms
          attributionEnabled={false}
          pointerEvents="none" // keep preview inert; Pressable handles the tap
        >
          <MapboxGL.Camera centerCoordinate={center} zoomLevel={zoom} />

          {/* One child container = no TS/annotation limits */}
          <MapboxGL.MarkerView coordinate={center} anchor={{ x: 0.5, y: 1 }}>
            <View className="items-center">
              {showCard ? (
                <View
                  className="bg-white px-3 py-2 rounded-2xl border border-gray-200"
                  style={{
                    marginBottom: 8,
                    shadowColor: '#000',
                    shadowOpacity: 0.08,
                    shadowRadius: 10,
                    shadowOffset: { width: 0, height: 4 },
                    elevation: 5,
                    maxWidth: 220,
                  }}
                >
                  {!!label && (
                    <Text className="text-[12px] text-gray-900 font-medium">
                      {label}
                    </Text>
                  )}
                  {!!subtitle && (
                    <Text
                      className="text-[11px] text-gray-500"
                      numberOfLines={1}
                    >
                      {subtitle}
                    </Text>
                  )}
                </View>
              ) : null}

              {/* dot */}
              <MapPin color={'#1E3A8A'} size={29} className="bg-primary" />
              {/* <View className="w-3 h-3 rounded-full bg-blue-600 border-2 border-white" /> */}
            </View>
          </MapboxGL.MarkerView>
        </MapboxGL.MapView>

        {/* full-card press target */}
        <Pressable
          onPress={onPress}
          style={{ position: 'absolute', inset: 0 }}
        />
        <View className="absolute right-2 bottom-2 bg-white/90 px-2 py-1 rounded-full">
          <Text className="text-sm text-gray-800 font-medium">Tap to open</Text>
        </View>
      </View>
    </View>
  );
}
