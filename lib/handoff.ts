import { Linking, Platform } from 'react-native';

export function openExternalDirections({
  lat,
  lng,
  label = 'Destination',
}: {
  lat: number;
  lng: number;
  label?: string;
}) {
  if (Platform.OS === 'ios') {
    // Apple Maps, fallback to Google if preferred
    Linking.openURL(
      `http://maps.apple.com/?daddr=${lat},${lng}&q=${encodeURIComponent(
        label,
      )}`,
    );
  } else {
    // Google Maps on Android
    Linking.openURL(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
    );
  }
}
