import {
  Text,
  View,
  ActivityIndicator,
  TextInput,
  StyleSheet,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Link } from "expo-router";
import * as SecureStore from "expo-secure-store";

async function save(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

import { useRouter } from "expo-router";
export default function Index() {
  const router = useRouter();
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();

  const postData = async () => {
    try {
      const response = await fetch("http://localhost:3000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: `${username}`,
          password: `${password}`,
        }),
      });

      const data = await response.json();
      console.log(data.access_token);
      if (data.access_token) {
        const token = data.access_token;
        save("access_token", token);
        router.navigate("/(app)/mainapp");
      } else {
        // alert("BREAK");
      }
    } catch (error) {
      console.error("Error making POST request:", error);
    }
    console.log("POST DATA");
  };

  const handleUsernameChange = (inputText: string) => {
    setUsername(inputText);
  };

  const handlePasswordChange = (inputText: string) => {
    setPassword(inputText);
  };

  return (
    <View style={styles.container}>
      <Text>아이디</Text>

      <TextInput
        style={styles.input}
        autoCapitalize="none"
        value={username}
        onChangeText={handleUsernameChange}
      />

      <Text>비밀번호</Text>
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        value={password}
        onChangeText={handlePasswordChange}
      />

      <View style={styles.center}>
        <Pressable onPress={() => postData()}>
          <Text>회원가입</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 200,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  center: {
    flex: 1,
    alignItems: "center",
  },
});
