import Mapbox, {
  Camera,
  CircleLayer,
  LineLayer,
  PointAnnotation,
  ShapeSource,
  UserLocation,
} from '@rnmapbox/maps';
import * as Location from 'expo-location';
import { useLocalSearchParams } from 'expo-router';
import type { FeatureCollection, GeoJsonProperties, Point } from 'geojson';
import { Navigation2, X } from 'lucide-react-native';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Keyboard, Platform, Text, TouchableOpacity, View } from 'react-native';
import hotels from '../../lib/data.json';

Mapbox.setAccessToken(
  'pk.eyJ1IjoibWF0dGhldy11a2FyaSIsImEiOiJjbTlteXBnamEwZGhhMmpyNzExbWd3ejE2In0.f5Qs76_7HLfHIC7hBwJmxg',
);
Mapbox.setWellKnownTileServer('mapbox');

type Coords = [number, number]; // [lon, lat]

// --- NEW: type for Mapbox geocoding features ---
type MBFeature = {
  id: string;
  place_name: string;
  text: string;
  center: [number, number]; // [lon, lat]
  properties?: Record<string, any>;
};

const Maps = () => {
  const cameraRef = useRef<Camera>(null);

  const [hasLocationPermission, setHasLocationPermission] = useState<
    boolean | null
  >(null);
  const [origin, setOrigin] = useState<Coords | null>(null);
  const [destination, setDestination] = useState<Coords | null>(null);

  const [routeGeoJSON, setRouteGeoJSON] = useState<any>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [durationMin, setDurationMin] = useState<number | null>(null);
  const [steps, setSteps] = useState<string[]>([]);

  // --- NEW: simple lock to debounce long-press routing ---
  const longPressLock = useRef(false);

  // --- NEW: search UI state ---
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<MBFeature[]>([]);
  const [isInputFocused, setIsInputFocused] = useState(false);

  // --- NEW: watch user movement continuously instead of one-time getCurrentPosition ---
  useEffect(() => {
    let watchSub: Location.LocationSubscription | null = null;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(status === 'granted');

      if (status === 'granted') {
        try {
          watchSub = await Location.watchPositionAsync(
            {
              accuracy:
                Platform.OS === 'android'
                  ? Location.Accuracy.Balanced
                  : Location.Accuracy.Highest,
              timeInterval: 1000, // ms
              distanceInterval: 3, // meters
            },
            (pos) => {
              setOrigin([pos.coords.longitude, pos.coords.latitude] as Coords);
            },
          );
        } catch (e) {
          console.warn('Could not start location watch', e);
        }
      }
    })();

    return () => {
      watchSub?.remove();
    };
  }, []);

  // --- Convert dummy hotels to GeoJSON(FeatureCollection) | memoized to avoid re-allocations ---
  const hotelsGeoJSON = useMemo<FeatureCollection<Point, GeoJsonProperties>>(
    () => ({
      type: 'FeatureCollection',
      features: hotels.map((h) => ({
        type: 'Feature',
        id: h.id,
        properties: { name: h.name },
        geometry: {
          type: 'Point',
          coordinates: [h.longitude, h.latitude],
        },
      })),
    }),
    [],
  );

  // 2) Helper: fetch directions & build GeoJSON
  const fetchRoute = useCallback(async (from: Coords, to: Coords) => {
    try {
      const url =
        `https://api.mapbox.com/directions/v5/mapbox/driving/` +
        `${from[0]},${from[1]};${to[0]},${to[1]}` +
        `?alternatives=false&geometries=geojson&steps=true&overview=full` +
        `&access_token=pk.eyJ1IjoibWF0dGhldy11a2FyaSIsImEiOiJjbTlteXBnamEwZGhhMmpyNzExbWd3ejE2In0.f5Qs76_7HLfHIC7hBwJmxg`;

      const res = await fetch(url);
      const json = await res.json();

      // Basic sanity guard on response
      if (json?.code && json.code !== 'Ok') {
        console.warn('Directions API returned:', json.code);
      }

      const route = json?.routes?.[0];
      if (!route) {
        setRouteGeoJSON(null);
        setDistanceKm(null);
        setDurationMin(null);
        setSteps([]);
        return;
      }

      // Build a Feature for the polyline
      const lineFeature = {
        type: 'Feature',
        geometry: route.geometry, // already GeoJSON (LineString)
        properties: {},
      };

      setRouteGeoJSON({
        type: 'FeatureCollection',
        features: [lineFeature],
      });

      setDistanceKm(route.distance / 1000);
      setDurationMin(route.duration / 60);

      // Extract step instructions (first leg)
      const legSteps = route.legs?.[0]?.steps ?? [];
      setSteps(
        legSteps.map((s: any) => s.maneuver?.instruction).filter(Boolean),
      );

      // --- Safer camera fit (guard tiny routes) ---
      const coords: Coords[] = route.geometry.coordinates;
      if (coords.length >= 2) {
        const lons = coords.map((c) => c[0]);
        const lats = coords.map((c) => c[1]);
        const sw: Coords = [Math.min(...lons), Math.min(...lats)];
        const ne: Coords = [Math.max(...lons), Math.max(...lats)];
        // padding + duration
        cameraRef.current?.fitBounds(ne, sw, 48, 800);
      } else if (coords.length === 1) {
        cameraRef.current?.setCamera({
          centerCoordinate: coords[0],
          zoomLevel: 16,
          animationDuration: 600,
        });
      }
    } catch (err) {
      console.warn('Directions error:', err);
    }
  }, []);

  // 3) When destination is picked, compute route from current origin
  useEffect(() => {
    if (origin && destination) {
      fetchRoute(origin, destination);
    }
  }, [origin, destination, fetchRoute]);

  // 4) Long-press to set destination (in [lon, lat]) with debounce
  const handleLongPress = useCallback((e: any) => {
    if (longPressLock.current) return;
    longPressLock.current = true;

    const coords = e.geometry?.coordinates as Coords | undefined;
    if (coords) setDestination(coords);

    setTimeout(() => {
      longPressLock.current = false;
    }, 600);
  }, []);

  // --- NEW: tap on map to dismiss search dropdown/keyboard ---
  const handleMapTap = useCallback(() => {
    Keyboard.dismiss();
    setIsInputFocused(false);
    setIsSearching(false);
    setSuggestions([]);
  }, []);

  // --- NEW: recenter to user origin ---
  const recenterToUser = useCallback(() => {
    if (origin) {
      cameraRef.current?.setCamera({
        centerCoordinate: origin,
        zoomLevel: 15,
        animationDuration: 600,
      });
    }
  }, [origin]);

  // --- NEW: clear destination & route ---
  const clearRoute = useCallback(() => {
    setDestination(null);
    setRouteGeoJSON(null);
    setDistanceKm(null);
    setDurationMin(null);
    setSteps([]);
  }, []);

  // 5) Show a fallback if no permission yet
  const initialCamera = useMemo(() => {
    if (origin) {
      return (
        <Camera ref={cameraRef} centerCoordinate={origin} zoomLevel={15} />
      );
    }
    if (hasLocationPermission) {
      // Waiting for first fix
      return <Camera ref={cameraRef} zoomLevel={12} />;
    }
    // Fallback to Lagos
    return (
      <Camera
        ref={cameraRef}
        centerCoordinate={[3.3792, 6.5244]}
        zoomLevel={12}
      />
    );
  }, [origin, hasLocationPermission]);

  const { lat, lon, title } = useLocalSearchParams<{
    lat?: string;
    lon?: string;
    title?: string;
  }>();

  // If route is opened with coordinates, set destination & move camera
  useEffect(() => {
    if (lat && lon) {
      const parsedLat = parseFloat(lat);
      const parsedLon = parseFloat(lon);
      if (!Number.isNaN(parsedLat) && !Number.isNaN(parsedLon)) {
        const dest: Coords = [parsedLon, parsedLat]; // [lon, lat]
        setDestination(dest);

        // Snap camera to destination (gentle zoom)
        cameraRef.current?.setCamera({
          centerCoordinate: dest,
          zoomLevel: 15,
          animationDuration: 600,
        });
      }
    }
  }, [lat, lon]);

  // --- NEW: Mapbox Geocoding fetch (forward geocode) ---
  const geocode = useCallback(
    async (q: string) => {
      try {
        setIsSearching(true);
        const enc = encodeURIComponent(q);
        const proximity = origin ? `&proximity=${origin[0]},${origin[1]}` : '';
        const url =
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${enc}.json` +
          `?autocomplete=true&limit=6&types=poi,address,place,neighborhood${proximity}` +
          `&access_token=pk.eyJ1IjoibWF0dGhldy11a2FyaSIsImEiOiJjbTlteXBnamEwZGhhMmpyNzExbWd3ejE2In0.f5Qs76_7HLfHIC7hBwJmxg`;

        const res = await fetch(url);
        const json = await res.json();
        setSuggestions((json?.features as MBFeature[]) ?? []);
      } catch (e) {
        console.warn('Geocoding error:', e);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    },
    [origin],
  );

  // --- NEW: debounce geocoding as user types ---
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    const t = setTimeout(() => geocode(q), 350);
    return () => clearTimeout(t);
  }, [query, geocode]);

  // --- NEW: choosing a suggestion -> set destination, center, route ---
  const handleSelectSuggestion = useCallback((feat: MBFeature) => {
    const [lonSel, latSel] = feat.center;
    const dest: Coords = [lonSel, latSel];
    setDestination(dest);
    setQuery(feat.place_name); // fill input with chosen place
    setSuggestions([]);

    cameraRef.current?.setCamera({
      centerCoordinate: dest,
      zoomLevel: 15,
      animationDuration: 600,
    });
    // No need to call fetchRoute directly; the origin+destination effect will trigger it
  }, []);

  return (
    <>
      {/* --- NEW: Search overlay --- */}
      {/* <View
        style={{
          position: 'absolute',
          top: 12,
          left: 12,
          right: 12,
          zIndex: 1000,
        }}
      >
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 8,
            shadowColor: '#000',
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 4,
          }}
        >
          <TextInput
            placeholder="Search a place, address, or hotel..."
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            autoCapitalize="none"
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            style={{ height: 40, fontSize: 16 }}
          />
        </View>

        {isInputFocused && (isSearching || suggestions.length > 0) && (
          <View
            style={{
              marginTop: 8,
              backgroundColor: 'white',
              borderRadius: 12,
              maxHeight: 260,
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOpacity: 0.15,
              shadowRadius: 4,
              elevation: 4,
            }}
          >
            {isSearching && (
              <View style={{ padding: 12, alignItems: 'center' }}>
                <ActivityIndicator />
              </View>
            )}

            {!isSearching && (
              <FlatList
                data={suggestions}
                keyExtractor={(item) => item.id}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleSelectSuggestion(item)}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: '#eee',
                    }}
                  >
                    <Text style={{ fontWeight: '600' }}>{item.text}</Text>
                    <Text style={{ color: '#6B7280', marginTop: 2 }}>
                      {item.place_name}
                    </Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <View style={{ padding: 12 }}>
                    <Text style={{ color: '#6B7280' }}>No results</Text>
                  </View>
                }
              />
            )}
          </View>
        )}
      </View> */}

      <Mapbox.MapView
        style={{ flex: 1 }}
        styleURL="mapbox://styles/mapbox/dark-v11"
        onLongPress={handleLongPress} // 👈 long-press to set destination
        onPress={handleMapTap}
        logoEnabled
        compassEnabled
        scaleBarEnabled
      >
        {initialCamera}

        {/* Blue dot */}
        <UserLocation
          visible
          showsUserHeadingIndicator
          androidRenderMode="compass"
        />

        {/* Destination pin */}
        {destination && (
          <PointAnnotation
            id="dest"
            coordinate={destination}
            title={title || 'Destination'}
            snippet={title ? 'Selected hotel' : 'Selected location'}
          >
            <View />
          </PointAnnotation>
        )}

        {/* Route line */}
        {routeGeoJSON && (
          <ShapeSource id="routeSource" shape={routeGeoJSON}>
            <LineLayer
              id="routeLine"
              style={{
                lineWidth: 6,
                lineJoin: 'round',
                lineCap: 'round',
                // Set a custom color if you prefer:
                lineColor: '#636AE8',
              }}
            />
          </ShapeSource>
        )}

        {/* Hotels (clustered) — tap to route */}
        {hotelsGeoJSON && (
          <ShapeSource
            id="hotelsSource"
            shape={hotelsGeoJSON}
            cluster
            clusterRadius={40}
            onPress={(e) => {
              const f = e.features?.[0];
              // For clusters, geometry is a cluster point; skip routing
              if (f?.properties?.cluster) return;
              const coords =
                f?.geometry?.type === 'Point'
                  ? ((f.geometry as any).coordinates as Coords)
                  : undefined;
              if (coords) setDestination(coords);
            }}
          >
            <CircleLayer
              id="hotelsCircleLayer"
              style={{
                circleRadius: 6,
                circleColor: '#ff4d4d',
                circleStrokeWidth: 2,
                circleStrokeColor: 'white',
              }}
            />
            {/* Optional: you could add cluster layers here for nicer visuals */}
          </ShapeSource>
        )}
      </Mapbox.MapView>

      {/* Simple HUD for ETA */}
      {distanceKm != null && durationMin != null && (
        <View
          style={{
            position: 'absolute',
            left: 12,
            right: 12,
            bottom: 16,
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: 12,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: 'white', fontWeight: '600' }}>
            {distanceKm.toFixed(1)} km • {Math.round(durationMin)} min
          </Text>
          {!!steps.length && (
            <Text
              style={{ color: 'white', marginTop: 6 }}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              Next: {steps[0]}
            </Text>
          )}
          <Text style={{ color: 'white', marginTop: 6, opacity: 0.8 }}>
            Long-press anywhere to set destination
          </Text>
        </View>
      )}

      {/* Recenter & Clear buttons */}
      <View
        style={{
          position: 'absolute',
          right: 0,
          top: 72, // push below the search bar
          gap: 10,
        }}
      >
        <TouchableOpacity
          onPress={recenterToUser}
          className="bg-primary rounded-full flex flex-col justify-center items-center h-14 w-14"
        >
          <Navigation2 size={20} color={'#fff'} className="" />
          {/* <Text
            style={{
              fontWeight: '600',
              fontFamily: 'Montserrat',
              fontSize: 10,
            }}
          >
            Recenter
          </Text> */}
        </TouchableOpacity>

        {routeGeoJSON && (
          <TouchableOpacity
            onPress={clearRoute}
            style={{
              backgroundColor: '#636AE8',
              paddingHorizontal: 12,
              paddingVertical: 10,
              borderRadius: 10,
              shadowColor: '#000',
              shadowOpacity: 0.15,
              shadowRadius: 4,
              elevation: 3,
              alignItems: 'center',
            }}
          >
            <X color={'#fff'} />
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};
export default Maps;
