import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Slider from "@/components/onboarding/Slider";
import Slides from "@/data/onboardingdata";
import { Text } from "react-native";
import { act } from "react-test-renderer";

jest.mock("../components/onboarding/SlideItem.tsx", () => {
  return ({ item }: any) => {
    const React = require("react");
    const { Text } = require("react-native");
    return <Text>{item.title}</Text>;
  };
});

jest.mock("../components/onboarding/Pagination.tsx", () => {
  return ({ index }: any) => {
    const React = require("react");
    const { Text } = require("react-native");
    return <Text>Pagination: {index}</Text>;
  };
});

describe("Slider component", () => {
  it("renders all slides", () => {
    const { getAllByText } = render(<Slider />);
    Slides.forEach((slide) => {
      expect(getAllByText(slide.title).length).toBeGreaterThan(0);
    });
  });

  it("displays correct initial pagination index", () => {
    const { getByText } = render(<Slider />);
    expect(getByText("Pagination: 0")).toBeTruthy();
  });

  it("updates index on viewable item change", async () => {
    const { getByText, UNSAFE_getByType } = render(<Slider />);

    const flatList = UNSAFE_getByType(require("react-native").FlatList);

    await act(async () => {
      flatList.props.onViewableItemsChanged({
        viewableItems: [
          { item: Slides[1], index: 1, isViewable: true, key: "1" },
        ],
      });
    });

    await waitFor(() => {
      expect(getByText("Pagination: 1")).toBeTruthy();
    });
  });
});
