import { useQuery } from "@tanstack/react-query";

import * as SecureStore from "expo-secure-store";
async function getToken() {
  return await SecureStore.getItemAsync("access_token");
}

import Constants from "expo-constants";
const { API_URL } = Constants.expoConfig.extra;
const FINAL_API_URL = `${API_URL}` + `/todos`;

const getTodos = async () => {
  const token = await getToken();

  const response = await fetch(FINAL_API_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const result = await response.json();
  return result;
};

export const useTodos = () => {
  const { data: fetchedTodos, isPending } = useQuery({
    queryKey: ["todos"],
    queryFn: getTodos,
  });

  return { fetchedTodos, isPending };
};
