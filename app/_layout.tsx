import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { NextHeaderButton } from '@/components/NextHeaderButton';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ animation: 'slide_from_right' }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="profile-setup" options={{ title: 'Artist Profile' }} />
        <Stack.Screen
          name="voice-input"
          options={{ headerShown: false, animation: 'slide_from_bottom' }}
        />
        <Stack.Screen name="review" options={{ title: 'Review' }} />
        <Stack.Screen name="campaign-loading" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen
          name="campaign"
          options={{
            title: 'Campaign',
            headerRight: () => <NextHeaderButton to="/email-preview" label="Emails" />,
          }}
        />
        <Stack.Screen
          name="email-preview"
          options={{
            title: 'Email Preview',
            headerRight: () => <NextHeaderButton to="/social-preview" label="Social" />,
          }}
        />
        <Stack.Screen
          name="social-preview"
          options={{
            title: 'Social Preview',
            headerRight: () => <NextHeaderButton to="/press-release" label="Press" />,
          }}
        />
        <Stack.Screen
          name="press-release"
          options={{
            title: 'Press Release',
            headerRight: () => <NextHeaderButton to="/timeline" label="Timeline" />,
          }}
        />
        <Stack.Screen name="timeline" options={{ title: 'Timeline' }} />
      </Stack>
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}
