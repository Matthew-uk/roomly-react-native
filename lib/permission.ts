// permissions.ts
import { Platform } from 'react-native';
import { PERMISSIONS, RESULTS, check, request } from 'react-native-permissions';

export async function askLocationPermission() {
  const perm =
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
      : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

  const status = await check(perm);
  if (status === RESULTS.GRANTED) return true;

  const next = await request(perm);
  if (next === RESULTS.GRANTED) return true;

  if (next === RESULTS.BLOCKED) {
    // optional: prompt user to open settings
    // await openSettings();
  }
  return false;
}
