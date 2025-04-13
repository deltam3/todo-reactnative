import { TodoItemType } from "@/app/(app)/(tabs)/mainapp";

import Constants from "expo-constants";
const { API_URL } = Constants.expoConfig.extra;
const FINAL_API_URL = `${API_URL}` + `/todos`;

import * as SecureStore from "expo-secure-store";
async function getToken() {
  return await SecureStore.getItemAsync("access_token");
}

const addTodoItem = async (todoItem: TodoItemType) => {
  const token = await getToken();
  const response = await fetch(FINAL_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todoItem),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const result = await response.json();
  return result;
};

export const useAddTodo = async (todoItem: TodoItemType) => {
  try {
    console.log("API ADD: " + API_URL);
    const result = await addTodoItem(todoItem);
    return result;
  } catch (error) {
    console.error("Error adding todo:", error);
    throw error;
  }
};
