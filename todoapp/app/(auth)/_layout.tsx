import { Redirect, router, Stack } from "expo-router";

import { SafeAreaView } from "react-native-safe-area-context";
export default function AppIndexLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="loginScreen"
        options={{
          presentation: "formSheet",
          sheetGrabberVisible: true,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="signupScreen"
        options={{
          presentation: "formSheet",
          sheetGrabberVisible: true,
          headerShown: false,
        }}
      />
    </Stack>
  );
}
