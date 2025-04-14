// import { Redirect } from "expo-router";

// import * as SecureStore from "expo-secure-store";

// async function getValueFor(key: string) {
//   let result = SecureStore.getItem(key);
//   return result;
// }

// export default function Index() {
//   const isOnboardingDone = getValueFor("isOnboarded");
//   const isLoginDone = getValueFor("access_token");

//   // onboarding not done, login not yet
//   if (!isOnboardingDone) {
//     return <Redirect href="/(onboarding)/onboarding" />;
//   }
//   // onboarding done, login not yet
//   if (isOnboardingDone && !isLoginDone) {
//     return <Redirect href="/(auth)/loginScreen" />;
//   }

//   if (isOnboardingDone && isLoginDone) {
//     return <Redirect href="/(app)/(tabs)/mainapp" />;
//   }
// }

import { useEffect, useState } from "react";
import { Redirect } from "expo-router";

import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
async function getValueFor(key: string) {
  let result = await SecureStore.getItemAsync(key);
  console.log(`index ${result}`);
  return result;
}

import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync(); // 👈 prevents auto hide

export default function Index() {
  useEffect(() => {
    const prepare = async () => {
      // Simulate loading resources
      await new Promise((resolve) => setTimeout(resolve, 10000));
      await SplashScreen.hideAsync(); // 👈 manually hide when ready
    };

    prepare();
  }, []);

  const [isOnboardingDone, setIsOnboardingDone] = useState<string | null>(null);
  const [isLoginDone, setIsLoginDone] = useState<string | null>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSecureStore() {
      const onboarded = await AsyncStorage.getItem("isOnboarded");
      const loggedIn = await getValueFor("access_token");

      console.log(`index onboard:${onboarded}`);
      console.log(`index onboard:${loggedIn}`);
      setIsOnboardingDone(onboarded);
      setIsLoginDone(loggedIn);
      setLoading(false);
    }

    checkSecureStore();
  }, []);

  const onPressLogout = async () => {
    await SecureStore.deleteItemAsync("access_token");
  };
  const onPressBoard = async () => {
    await AsyncStorage.setItem("isOnboarded", "");
  };

  // return <Redirect href="/(onboarding)/onboarding" />;
  // return (
  //   <SafeAreaView>
  //     <View>
  //       <Text>Isboarding: {isOnboardingDone}</Text>
  //       <Text>isLoginDone: {isLoginDone}</Text>
  //       <Pressable onPress={onPressBoard}>
  //         <Text>DELETE ONBOARDING</Text>
  //       </Pressable>
  //       <Pressable onPress={onPressLogout}>
  //         <Text>DELETE ONPRESSLOGOUT</Text>
  //       </Pressable>
  //     </View>
  //   </SafeAreaView>
  // );

  if (loading) {
    return <ActivityIndicator size="large" color="#00ff00" />;
  }

  if (!isOnboardingDone) {
    return <Redirect href="/(onboarding)/onboarding" />;
  }

  if (isOnboardingDone && !isLoginDone) {
    // return <Redirect href="/(app)/(tabs)/mainapp" />;
    return <Redirect href="/(auth)/loginScreen" />;
  }

  if (isOnboardingDone && isLoginDone) {
    return <Redirect href="/(app)/(tabs)/mainapp" />;
  }
}
