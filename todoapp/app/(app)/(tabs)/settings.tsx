import useCheckLoginStatus from "@/hooks/useCheckLoginStatus";
import { Redirect, router } from "expo-router";
import { Pressable, Text, View } from "react-native";

import * as SecureStore from "expo-secure-store";
import Card from "@/components/ui/Card";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
async function getToken() {
  return await SecureStore.getItemAsync("access_token");
}

export default function Settings() {
  const isAuthenticated = useCheckLoginStatus();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/loginScreen" />;
  }

  const onPressLogout = () => {
    SecureStore.deleteItemAsync("access_token");
    router.navigate("/(auth)/loginScreen");
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <ThemedText style={{ textAlign: "center", marginVertical: 18 }}>
        설정
      </ThemedText>

      <Pressable onPress={() => onPressLogout()}>
        <Card>
          <ThemedText style={{ textAlign: "center" }}>로그아웃</ThemedText>
        </Card>
      </Pressable>
    </ThemedView>
  );
}
