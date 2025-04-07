import { TodoItemType } from "@/app/(app)/mainapp";

const API_URL = "http://localhost:3000/todos/sync";

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
