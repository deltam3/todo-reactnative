import { Tabs } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="mainapp"
        options={{
          title: "홈",
          tabBarIcon: () => <AntDesign name="home" size={18} color="black" />,
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "설정",
          tabBarIcon: () => (
            <AntDesign name="setting" size={18} color="black" />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
