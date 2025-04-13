import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import LoginScreen from "../app/(auth)/loginScreen";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
  Link: ({ href, children }: any) => <>{children}</>,
}));

jest.mock("expo-secure-store", () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ access_token: "mock_token" }),
  })
) as jest.Mock;

describe("LoginScreen", () => {
  const navigate = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ navigate });
    jest.clearAllMocks();
  });

  it("renders the form fields and login button", async () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);

    expect(getByPlaceholderText("Username")).toBeTruthy();
    expect(getByPlaceholderText("Password")).toBeTruthy();
    expect(getByText("로그인")).toBeTruthy();
  });

  it("shows validation errors when inputs are empty", async () => {
    const { getByText } = render(<LoginScreen />);
    fireEvent.press(getByText("로그인"));

    await waitFor(() => {
      expect(getByText("아이디는 필수입니다.")).toBeTruthy();
      expect(getByText("비밀번호는 필수입니다.")).toBeTruthy();
    });
  });

  it("submits form with valid inputs and navigates", async () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText("Username"), "johnDoe");
    fireEvent.changeText(getByPlaceholderText("Password"), "123456");

    fireEvent.press(getByText("로그인"));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:3000/auth/login",
        expect.objectContaining({
          method: "POST",
        })
      );
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
        "access_token",
        "mock_token"
      );
      expect(navigate).toHaveBeenCalledWith("/(app)/(tabs)/mainapp");
    });
  });
});
