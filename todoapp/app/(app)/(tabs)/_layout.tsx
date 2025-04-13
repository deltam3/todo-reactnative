import { Tabs } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useColorScheme, View } from "react-native";
import { Colors } from "@/constants/Colors";

export default function TabLayout() {
  // const colorScheme = useColorScheme(); // 'light' or 'dark'
  const colorScheme = useColorScheme() ?? "light";

  // const bgColor = colorScheme === "dark" ? "#000" : "#fff";

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: Colors[colorScheme].background,
        },
        tabBarActiveTintColor: Colors[colorScheme].tabIconSelected,
        tabBarInactiveTintColor: Colors[colorScheme].tabIconDefault,
        headerStyle: {
          backgroundColor: colorScheme === "dark" ? "#000" : "#fff",
        },
        headerTitleStyle: {
          color: colorScheme === "dark" ? "#fff" : "#000",
        },
      }}
    >
      <Tabs.Screen
        name="mainapp"
        options={{
          title: "홈",
          tabBarIcon: () => (
            <AntDesign
              name="home"
              size={18}
              style={{ color: Colors[colorScheme].tint }}
            />
          ),
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "설정",
          tabBarIcon: () => (
            <AntDesign
              name="setting"
              size={18}
              style={{ color: Colors[colorScheme].tint }}
            />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
