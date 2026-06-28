import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="profile-setup" options={{ title: 'Artist Profile' }} />
        <Stack.Screen name="voice-input" options={{ title: 'VoiceInput' }} />
        <Stack.Screen name="review" options={{ title: 'Review' }} />
        <Stack.Screen name="campaign" options={{ title: 'Campaign' }} />
        <Stack.Screen name="timeline" options={{ title: 'Timeline' }} />
      </Stack>
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}
