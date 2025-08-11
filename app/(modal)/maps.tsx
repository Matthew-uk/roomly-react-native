import Mapbox from '@rnmapbox/maps';
Mapbox.setAccessToken(
  'pk.eyJ1IjoibWF0dGhldy11a2FyaSIsImEiOiJjbTlteXBnamEwZGhhMmpyNzExbWd3ejE2In0.f5Qs76_7HLfHIC7hBwJmxg',
);

const Maps = () => {
  return <Mapbox.MapView style={{ flex: 1 }} />;
};

export default Maps;
