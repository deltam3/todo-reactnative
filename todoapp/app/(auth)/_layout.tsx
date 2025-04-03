import { Redirect, router, Stack } from "expo-router";

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
    </Stack>
  );
}
