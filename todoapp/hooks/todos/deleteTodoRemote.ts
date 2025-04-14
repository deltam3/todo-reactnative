import { TodoItemType } from "@/app/(app)/(tabs)/mainapp";

import Constants from "expo-constants";
const { API_URL } = Constants.expoConfig.extra;
const FINAL_API_URL = `${API_URL}` + `/todos`;

import * as SecureStore from "expo-secure-store";
async function getToken() {
  return await SecureStore.getItemAsync("access_token");
}

const deleteNoteItem = async (noteItemId: number) => {
  const token = await getToken();
  const tester = `${API_URL}/${noteItemId}`;
  console.log(`tester: ${tester}`);

  const response = await fetch(`${FINAL_API_URL}/${noteItemId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    // body: JSON.stringify(noteItemId),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const result = await response.json();
  return result;
};

export const deleteTodoRemote = (noteItemId: number) => {
  const result = deleteNoteItem(noteItemId);
  return result;
};
