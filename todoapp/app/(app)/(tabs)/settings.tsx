import useCheckLoginStatus from "@/hooks/useCheckLoginStatus";
import { Redirect, router } from "expo-router";
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import * as SecureStore from "expo-secure-store";
import Card from "@/components/ui/Card";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import Button from "@/components/ui/Button";
import { Colors } from "@/constants/Colors";
async function getToken() {
  return await SecureStore.getItemAsync("access_token");
}

export default function Settings() {
  const isAuthenticated = useCheckLoginStatus();

  if (isAuthenticated === null) {
    return <ActivityIndicator size="large" color="#00ff00" />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/loginScreen" />;
  }

  const onPressLogout = () => {
    SecureStore.deleteItemAsync("access_token");
    router.navigate("/(auth)/loginScreen");
  };

  return (
    <ThemedView style={styles.safeArea}>
      <ThemedText style={{ textAlign: "center", marginVertical: 18 }}>
        설정
      </ThemedText>

      <Pressable onPress={() => onPressLogout()}>
        <Card style={{ backgroundColor: Colors.light.tint }}>
          <ThemedText style={{ textAlign: "center", color: "white" }}>
            로그아웃
          </ThemedText>
        </Card>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: 24,
    paddingHorizontal: 8,
  },
});
