import { Tabs, Stack } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { SQLiteProvider, openDatabaseAsync } from "expo-sqlite";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  useColorScheme,
  View,
} from "react-native";
// export default function AppLayout() {
//   return (
//     <React.Suspense
//       fallback={
//         <View style={{ flex: 1 }}>
//           <ActivityIndicator size={"large"} />
//           <Text>데이터베이스 로딩중...</Text>
//         </View>
//       }
//     >
//       <SQLiteProvider
//         databaseName="SqliteDb.db"
//         assetSource={{ assetId: require("@/data/SqliteDb.db") }}
//         useSuspense
//       >
//         <Tabs>
//           <Tabs.Screen
//             name="mainapp"
//             options={{
//               title: "홈",
//               tabBarIcon: () => (
//                 <AntDesign name="home" size={18} color="black" />
//               ),
//               headerShown: false,
//             }}
//           />

//           <Tabs.Screen
//             name="settings"
//             options={{
//               title: "설정",
//               tabBarIcon: () => (
//                 <AntDesign name="setting" size={18} color="black" />
//               ),
//               headerShown: false,
//             }}
//           />
//         </Tabs>
//       </SQLiteProvider>
//     </React.Suspense>
//   );
// }

export default function AppLayout() {
  const colorScheme = useColorScheme(); // 'light' or 'dark'

  const isDark = colorScheme === "dark";
  return (
    <React.Suspense
      fallback={
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
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
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: isDark ? "#121212" : "#ffffff", // header background
            },
            headerTintColor: isDark ? "#fff" : "#000", // back button and title
            contentStyle: {
              backgroundColor: isDark ? "#000" : "#fff", // screen background
            },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </SQLiteProvider>
    </React.Suspense>
  );
}
