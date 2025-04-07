import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Network from "expo-network";
import { useEffect } from "react";

const storeNowData = async (value: boolean) => {
  try {
    await AsyncStorage.setItem("isNowInternetStatusOffline", String(value));
  } catch (e) {}
};

const storePreviousData = async (value: boolean) => {
  try {
    await AsyncStorage.setItem(
      "isPreviousInternetStatusOffline",
      String(value)
    );
  } catch (e) {}
};

const getPreviousData = async () => {
  try {
    const value = await AsyncStorage.getItem("isPreviousInternetStatusOffline");

    if (value !== null) {
      return Boolean(value);
    } else {
      storePreviousData(false);
    }
  } catch (e) {
    // error handle
  }
};

import * as SQLite from "expo-sqlite";
// const function
// const db = await SQLite.openDatabaseAsync("databaseName");

const useUploadTodoItem = async () => {
  const networkState = Network.useNetworkState().isInternetReachable;

  // 1, save the current internet status
  const currentInternetStatus = networkState;

  // 2 check the previous internet status
  const previousInternetStatus = await getPreviousData();

  // 3   if the previous internet status was offline
  if (previousInternetStatus === false) {
    if (currentInternetStatus === false) {
      try {
        await AsyncStorage.setItem("isNowInternetStatusOffline", String(false));
      } catch (e) {
        console.error(e);
      }
    }

    if (currentInternetStatus === true) {
    }
  }

  // 4, if the previous internet status was online
  if (previousInternetStatus === true) {
    if (currentInternetStatus === false) {
    }

    if (currentInternetStatus === true) {
    }
  }
};

export default useUploadTodoItem;
