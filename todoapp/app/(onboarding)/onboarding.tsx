import { Text, View, StyleSheet, Button, Pressable } from "react-native";
import { Link } from "expo-router";

import Slider from "../../components/onboarding/Slider";
import * as SecureStore from "expo-secure-store";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
async function save(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

async function getValueFor(key: string) {
  let result = await SecureStore.getItemAsync(key);
  return result;
}

export default function Index() {
  return (
    <View style={styles.container}>
      <Slider />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
    backgroundColor: Colors.light.background,
  },
  text: {
    color: "#fff",
  },
  button: {
    fontSize: 20,
    textDecorationLine: "underline",
    color: "#fff",
  },
});
