import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import SignupScreen from "@/app/(auth)/signupScreen";
import { useRouter } from "expo-router";
import { setItemAsync } from "expo-secure-store";

jest.mock("expo-router", () => ({
  useRouter: () => ({
    replace: jest.fn(),
  }),
}));

jest.mock("expo-secure-store", () => ({
  setItemAsync: jest.fn(),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ access_token: "mock_token" }),
  })
) as jest.Mock;

describe("Signup Screen", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
  it("renders the form inputs and button", () => {
    const { getByPlaceholderText, getByText } = render(<SignupScreen />);
    expect(getByPlaceholderText("Username")).toBeTruthy();
    expect(getByPlaceholderText("Password")).toBeTruthy();
    expect(getByText("회원가입하기")).toBeTruthy();
  });

  it("shows validation error for empty inputs", async () => {
    const { getByText, getByPlaceholderText } = render(<SignupScreen />);
    fireEvent.press(getByText("회원가입하기"));

    await waitFor(() => {
      expect(getByText("아이디는 필수입니다.")).toBeTruthy();
      expect(getByText("비밀번호는 필수입니다.")).toBeTruthy();
    });
  });

  it("submits form and navigates on success", async () => {
    const { getByPlaceholderText, getByText } = render(<SignupScreen />);
    const usernameInput = getByPlaceholderText("Username");
    const passwordInput = getByPlaceholderText("Password");

    fireEvent.changeText(usernameInput, "testuser1");
    fireEvent.changeText(passwordInput, "password123");
    fireEvent.press(getByText("회원가입하기"));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:3000/auth/signup",
        expect.any(Object)
      );
    });
  });

  it("handles failed signup", async () => {
    global.alert = jest.fn();

    (fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({}),
      })
    );

    const { getByPlaceholderText, getByText } = render(<SignupScreen />);

    fireEvent.changeText(getByPlaceholderText("Username"), "user");
    fireEvent.changeText(getByPlaceholderText("Password"), "pass1234");
    fireEvent.press(getByText("회원가입하기"));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith(
        "오류가 발생했습니다. 네트워크 상태를 확인해주세요."
      );
    });
  });
});
