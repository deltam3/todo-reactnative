import { TodoItemType } from "@/app/(app)/(tabs)/mainapp";

const API_URL = "http://localhost:3000/todos/";

import * as SecureStore from "expo-secure-store";
async function getToken() {
  return await SecureStore.getItemAsync("access_token");
}

const editTodoItem = async (todoItem: TodoItemType) => {
  const token = await getToken();
  const response = await fetch(`${API_URL}+${todoItem.localId}`, {
    method: "PATCH",
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

export const useEditTodo = async (todoItem: TodoItemType) => {
  try {
    const result = await editTodoItem(todoItem);
    console.log();
    return result;
  } catch (error) {
    console.error("Error adding todo:", error);
    throw error;
  }
};
