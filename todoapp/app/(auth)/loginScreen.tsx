import { Text, View, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const [isLoaded, setIsLoaded] = useState("Not loaded");

  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem("isOnboarded");
        if (value !== null) {
          // value previously stored
          setIsLoaded(value);
        }
      } catch (e) {
        // error reading value
      }
    };
    getData();
  }, []);

  return (
    <View>
      <Text>UserName</Text>
      <Text>{isLoaded}</Text>
    </View>
  );
}
