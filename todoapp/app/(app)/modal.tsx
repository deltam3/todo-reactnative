// import useCheckLoginStatus from "@/hooks/useCheckLoginStatus";

// import { StyleSheet, Text, View, TextInput, Pressable } from "react-native";
// import { Redirect, useLocalSearchParams } from "expo-router";

// import { useForm, SubmitHandler, Controller } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useTodos } from "@/hooks/todos/useGetTodo";

// const EditTodoSchema = z.object({
//   title: z.string().min(1, "최소 1글자 이상 입력"),
//   description: z.string().min(1, "최소 1글자 이상 입력"),
//   completed: z.boolean(),
// });

// type EditTodoFormData = z.infer<typeof EditTodoSchema>;

// export default function Modal() {
//   const isAuthenticated = useCheckLoginStatus();

//   if (!isAuthenticated) {
//     return <Redirect href="/(auth)/loginScreen" />;
//   }

//   const { itemId, title, description, completed } = useLocalSearchParams();

//   return (
//     <View style={styles.container}>
//       <Text>Modal screen</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });
