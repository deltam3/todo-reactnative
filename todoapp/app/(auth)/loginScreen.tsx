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


import { useRouter, Redirect } from "expo-router";

async function save(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

async function getValueFor(key: string) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    console.log(result);
  } else {
    console.log(result);
  }
}
import { useNavigation } from '@react-navigation/native';

export default function Index() {
  const navigation = useNavigation();


  const router = useRouter();

  const [username, setUsername] = useState<string>("temp1");
  const [password, setPassword] = useState<string>("pass");

  const handleUsernameChange = (inputText: string) => {
    setUsername(inputText);
  };

  const handlePasswordChange = (inputText: string) => {
    setPassword(inputText);
  };

  const postData = async () => {
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
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

      if (data.access_token) {
        const token = data.access_token;
        save("access_token", token);
        router.navigate("/(app)/(tabs)/mainapp");

      } else {
        alert("BREAK");
      }
    } catch (error) {
      console.error("Error making POST request:", error);
    }
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

      <View>
        <Pressable onPress={() => postData()}>
          <Text>로그인</Text>
        </Pressable>
      </View>

      <View>
        <Link href="/(auth)/signupScreen">회원가입</Link>
      </View>

      <View>
        <Pressable onPress={() => getValueFor("access_token")}>
          <Text>결과</Text>
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
});
