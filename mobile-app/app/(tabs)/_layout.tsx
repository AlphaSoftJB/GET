import { Stack } from "expo-router";

// The GET app uses a fully custom in-app navigation (bottom tab bar + drawer)
// rendered inside the single orchestrator screen, so we hide the native header
// and expose just one route.
export default function TabLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
