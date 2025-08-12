import Mapbox, { Camera, UserLocation } from '@rnmapbox/maps';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';

Mapbox.setAccessToken(
  'pk.eyJ1IjoibWF0dGhldy11a2FyaSIsImEiOiJjbTlteXBnamEwZGhhMmpyNzExbWd3ejE2In0.f5Qs76_7HLfHIC7hBwJmxg',
);
Mapbox.setWellKnownTileServer('mapbox');

export default function Maps() {
  const [hasLocationPermission, setHasLocationPermission] = useState<
    boolean | null
  >(null);

  useEffect(() => {
    (async () => {
      // Ask for foreground permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(status === 'granted');

      // (Optional) Warm up a first fix on Android so the camera follows immediately
      if (status === 'granted' && Platform.OS === 'android') {
        try {
          await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
        } catch {}
      }
    })();
  }, []);

  return (
    <Mapbox.MapView
      style={{ flex: 1 }}
      styleURL="mapbox://styles/mapbox/streets-v12"
      onMapLoadingError={(e: any) => console.warn('Map loading error:', e)}
      onMapError={(e: any) => console.warn('Map error:', e.nativeEvent)}
    >
      {/* Blue dot */}
      <UserLocation
        visible
        showsUserHeadingIndicator
        androidRenderMode="COMPASS"
      />

      {hasLocationPermission ? (
        // Follow user when permission is granted
        <Camera
          followUserLocation
          followUserMode="normal"
          followZoomLevel={15}
        />
      ) : (
        // Fallback: Lagos
        <Camera centerCoordinate={[3.3792, 6.5244]} zoomLevel={12} />
      )}
    </Mapbox.MapView>
  );
}
