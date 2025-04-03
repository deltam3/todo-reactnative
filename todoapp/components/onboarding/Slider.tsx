import {
  Animated,
  FlatList,
  StyleSheet,
  Text,
  View,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ImageURISource,
} from "react-native";
import React, { useRef, useState } from "react";
import Slides from "../../data/onboardingdata";
import SlideItem from "./SlideItem";
import Pagination from "./Pagination";

interface Slide {
  id: number;
  title: string;
  description: string;

  img: ImageURISource;
}

interface ViewToken<T = Slide> {
  item: T;
  index: number | null;
  isViewable: boolean;
  key: string;
}

const Slider = () => {
  const [index, setIndex] = useState<number>(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleOnScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    Animated.event(
      [
        {
          nativeEvent: {
            contentOffset: {
              x: scrollX,
            },
          },
        },
      ],
      {
        useNativeDriver: false,
      }
    )(event);
  };

  const handleOnViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      setIndex(viewableItems[0]?.index ?? 0);
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  return (
    <View>
      <FlatList
        data={Slides}
        renderItem={({ item }: { item: Slide }) => (
          <SlideItem item={item} isLastItem={index === Slides.length - 1} />
        )}
        horizontal
        pagingEnabled
        snapToAlignment="center"
        showsHorizontalScrollIndicator={false}
        onScroll={handleOnScroll}
        onViewableItemsChanged={handleOnViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
      <Pagination data={Slides} scrollX={scrollX} index={index} />
    </View>
  );
};

export default Slider;
