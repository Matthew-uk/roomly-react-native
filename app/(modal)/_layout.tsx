import { Stack } from 'expo-router';

export default function ModalLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="filter"
        options={{
          title: 'Modal Home',
          presentation: 'modal',
          headerShown: true,
          headerTitle: 'Filter',
          headerTitleStyle: {
            fontSize: 20,
            fontFamily: 'Montserrat-Bold',
          },
          headerBackTitle: 'Back',
          headerBackTitleStyle: {
            fontSize: 16,
            fontFamily: 'bold',
          },
          headerBackButtonDisplayMode: 'minimal',
        }} // Customize the title if needed
      />
      <Stack.Screen
        name="maps"
        options={{
          presentation: 'fullScreenModal',
          headerShown: true,
          headerTitle: 'Maps',
          headerTitleStyle: {
            fontSize: 20,
            fontFamily: 'Montserrat-Bold',
          },
          headerBackTitle: 'Back',
          headerBackTitleStyle: {
            fontSize: 16,
            fontFamily: 'bold',
          },
          headerBackButtonDisplayMode: 'default',
          //   headerShown: false,
        }}
      />
    </Stack>
  );
}
