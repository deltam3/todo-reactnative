import { TodoItemType } from "@/app/(app)/(tabs)/mainapp";

import Constants from "expo-constants";
const { API_URL } = Constants.expoConfig.extra;
const FINAL_API_URL = `${API_URL}` + `/todos/sync`;

export const useUploadTodos = (todos: TodoItemType[]) => {
  const uploadTodos = async () => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todos),
      });

      if (!response.ok) {
        throw new Error("Failed to upload todos");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      // console.error("Error uploading todos:", error);
    }
  };

  const result = uploadTodos();

  return result;
};
