import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import React from "react";

import { Link } from "expo-router";

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
  const translateXImage = new Animated.Value(-20);

  Animated.timing(translateXImage, {
    toValue: 0,
    duration: 600,
    useNativeDriver: true,
    easing: Easing.inOut(Easing.ease),
  }).start();

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
          <View>
            <Link href="/(auth)/loginScreen">로그인하기</Link>
          </View>
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
