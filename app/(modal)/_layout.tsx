import { Stack } from 'expo-router';

export default function ModalLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="filter"
        options={{
          title: 'Modal Home',
          presentation: 'modal',
          headerShown: false,
        }} // Customize the title if needed
      />
      <Stack.Screen
        name="maps"
        options={{
          presentation: 'fullScreenModal',
          headerShown: false,
        }}
      />
    </Stack>
  );
}
