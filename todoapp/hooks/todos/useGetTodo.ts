import { useQuery } from "@tanstack/react-query";
// import * as SQLite from "expo-sqlite";
// import { useEffect } from "react";
// import * as Network from "expo-network";

const API_URL = "http://localhost:3000/todos/";

const getTodos = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const useTodos = () => {
  const result = useQuery({ queryKey: ["todos"], queryFn: getTodos });
  return result;
};
