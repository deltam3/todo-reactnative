import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Animated,
  Easing,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";

const { width, height } = Dimensions.get("screen");

interface Slide {
  id: number;
  title: string;
  description: string;
  img: any;
}
interface SlideItemProps {
  item: Slide;
  isLastItem: boolean;
}

const SlideItem = ({ item, isLastItem }: SlideItemProps) => {
  const router = useRouter();
  const translateXImage = new Animated.Value(-20);

  Animated.timing(translateXImage, {
    toValue: 0,
    duration: 600,
    useNativeDriver: true,
    easing: Easing.inOut(Easing.ease),
  }).start();

  const onFinishOnboarding = async () => {
    try {
      await AsyncStorage.setItem("isOnboarded", "true");
      // const value = await AsyncStorage.getItem("isOnboarded");
      await AsyncStorage.getItem("isOnboarded");
      router.push("/(auth)/loginScreen");
    } catch (e) {
      console.error("Failed to set onboarding flag", e);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.Image
        source={item.img}
        resizeMode="contain"
        style={[
          styles.image,
          {
            transform: [
              {
                translateX: translateXImage,
              },
            ],
          },
        ]}
      />

      <View style={styles.content}>
        {isLastItem && (
          <Pressable onPress={onFinishOnboarding}>
            <View>
              <Text>로그인하기</Text>
            </View>
          </Pressable>
        )}

        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );
};

export default SlideItem;

const styles = StyleSheet.create({
  container: {
    width,
    height,
    alignItems: "center",
  },
  image: {
    flex: 0.6,
    width: "100%",
  },
  content: {
    flex: 0.4,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  description: {
    fontSize: 18,
    marginVertical: 12,
    color: "#333",
  },
});
