import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Settings from "@/app/(app)/(tabs)/settings";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

jest.mock("expo-secure-store");
jest.mock("expo-router", () => ({
  router: {
    navigate: jest.fn(),
  },
  Redirect: () => null,
}));

jest.mock("@/hooks/useCheckLoginStatus", () => () => true);

describe("Settings Screen", () => {
  it("renders and logs out successfully", async () => {
    const { getByText } = render(<Settings />);

    const logoutButton = getByText("로그아웃");
    expect(logoutButton).toBeTruthy();

    fireEvent.press(logoutButton);

    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("access_token");

    expect(router.navigate).toHaveBeenCalledWith("/(auth)/loginScreen");
  });
});
