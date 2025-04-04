import { Text, View, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import useCheckLoginStatus from "@/hooks/useCheckLoginStatus";
import { Redirect } from "expo-router";
import { Stack } from "expo-router";
import * as SQLite from "expo-sqlite";
import { SQLiteProvider, openDatabaseAsync } from "expo-sqlite";

const loadDatabase = async () => {
  const db = await openDatabaseAsync("../../assets/SqliteDb.db");
};

export default function Index() {
  // const isAuthenticated = useCheckLoginStatus();

  // if (!isAuthenticated) {
  //   return <Redirect href="/(auth)/loginScreen" />;
  // }

  const [dbloaded, setDbLoaded] = React.useState<boolean>(false);

  React.useEffect(() => {
    loadDatabase()
      .then(() => setDbLoaded(true))
      .catch((e) => console.error(e));
  }, []);

  return (
    <React.Suspense
      fallback={
        <View style={{ flex: 1 }}>
          <ActivityIndicator size={"large"} />
          <Text>데이터베이스 로딩중...</Text>
        </View>
      }
    >
      <SQLiteProvider
        databaseName="SqliteDb.db"
        assetSource={{ assetId: require("@/data/SqliteDb.db") }}
        useSuspense
      >
        <View>
          <Text>APP</Text>
          {/* <Text>{isAuthenticated && "Logged In"}</Text> */}
        </View>
      </SQLiteProvider>
    </React.Suspense>
  );
}
