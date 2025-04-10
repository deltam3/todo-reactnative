import useCheckLoginStatus from "@/hooks/useCheckLoginStatus";
import { Redirect } from "expo-router";
import { Text, View } from "react-native";

export default function Settings() {
  const isAuthenticated = useCheckLoginStatus();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/loginScreen" />;
  }
  return (
    <View>
      <Text>Settings</Text>
    </View>
  );
}
