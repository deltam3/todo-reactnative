import useCheckLoginStatus from "@/hooks/useCheckLoginStatus";
import { Redirect, router } from "expo-router";
import { Pressable, Text, View } from "react-native";

import * as SecureStore from "expo-secure-store";
import Card from "@/components/ui/Card";
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
    <View>
      <Card style={{ marginBottom: 18 }}>
        <Text style={{ textAlign: "center" }}>설정</Text>
      </Card>

      <Pressable onPress={() => onPressLogout()}>
        <Card>
          <Text style={{ textAlign: "center" }}>로그아웃</Text>
        </Card>
      </Pressable>
    </View>
  );
}
