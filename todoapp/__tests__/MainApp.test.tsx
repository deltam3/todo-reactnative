import React from "react";
import { render, act, waitFor } from "@testing-library/react-native";

import MainApp from "@/app/(app)/(tabs)/mainapp";

jest.mock("@/hooks/useCheckLoginStatus", () => () => true);
jest.mock("@/hooks/todos/useGetTodo", () => ({
  useTodos: () => ({
    fetchedTodos: [],
    isPending: false,
  }),
}));
jest.mock("@/hooks/todos/useAddTodo", () => ({
  useAddTodo: jest.fn(),
}));
jest.mock("expo-sqlite", () => {
  return {
    useSQLiteContext: () => ({
      execAsync: jest.fn(),
      getAllAsync: jest.fn().mockResolvedValue([]),
      withTransactionAsync: jest.fn().mockImplementation((cb) => cb()),
      runAsync: jest.fn().mockResolvedValue({ lastInsertRowId: 1 }),
    }),
  };
});
jest.mock("@/components/todo/TodoItem", () => "TodoItem");
jest.mock("@/components/ThemedView", () => ({
  ThemedView: ({ children }: any) => <>{children}</>,
}));
jest.mock("@/components/ThemedText", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    ThemedText: ({ children }: any) => <Text>{children}</Text>,
  };
});
jest.mock("@/components/ui/Button", () => ({ children }: any) => (
  <>{children}</>
));

describe("MainApp", () => {
  it("renders without crashing", () => {
    expect(() => render(<MainApp />)).not.toThrow();
  });
});
