import { useQuery } from "@tanstack/react-query";

import * as SecureStore from "expo-secure-store";
async function getToken() {
  return await SecureStore.getItemAsync("access_token");
}

import Constants from "expo-constants";
const { PREAPI_URL } = Constants.expoConfig.extra;
const API_URL = `${PREAPI_URL}` + `/todos`;

const getTodos = async () => {
  const token = await getToken();
  // console.log(token);
  const response = await fetch(API_URL, {
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
