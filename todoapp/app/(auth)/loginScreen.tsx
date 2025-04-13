import {
  Text,
  View,
  ActivityIndicator,
  TextInput,
  StyleSheet,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Link } from "expo-router";
import * as SecureStore from "expo-secure-store";

import { useRouter, Redirect } from "expo-router";

async function save(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

async function getValueFor(key: string) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    console.log(result);
  } else {
    console.log(result);
  }
}

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  username: z
    .string({ required_error: "최소 4글자 이상 입력" })
    .min(4, "아이디는 필수입니다."),
  password: z
    .string({ required_error: "최소 2글자 이상 입력" })
    .min(2, "비밀번호는 최소 2자 이상이어야 합니다.")
    .max(20, "비밀번호는 최대 20자까지 입력 가능합니다."),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const router = useRouter();

  const postData = async (data: LoginFormData) => {
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
        }),
      });

      const responseData = await response.json();

      if (responseData.access_token) {
        const token = responseData.access_token;
        save("access_token", token);
        router.navigate("/(app)/(tabs)/mainapp");
      } else {
        alert("로그인 실패: access_token이 없습니다.");
      }
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.label}>아이디</Text>

      <Controller
        control={control}
        name="username"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Username"
            onBlur={onBlur}
            onChangeText={onChange}
            autoCapitalize="none"
            value={value}
          />
        )}
      />
      {errors.username && (
        <Text style={styles.error}>{errors.username.message}</Text>
      )}

      <Text style={styles.label}>비밀번호</Text>

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            autoCapitalize="none"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.password && (
        <Text style={styles.error}>{errors.password.message}</Text>
      )}

      <Pressable style={styles.button} onPress={handleSubmit(postData)}>
        <Text style={styles.buttonText}>로그인</Text>
      </Pressable>

      <View style={styles.signupContainer}>
        <Link href="/(auth)/signupScreen">회원가입</Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: "center",
    flex: 1,
  },
  label: {
    marginBottom: 4,
    fontWeight: "bold",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#3478f6",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  signupContainer: {
    marginTop: 20,
    alignItems: "center",
  },
});

// const styles = StyleSheet.create({
//   container: {
//     paddingVertical: 200,
//     paddingHorizontal: 10,
//   },
// input: {
//   height: 40,
//   margin: 12,
//   borderWidth: 1,
//   padding: 10,
// },
// container: {
// padding: 20,
// },
//   input: {
//     height: 40,
//     borderColor: "gray",
//     borderWidth: 1,
//     marginBottom: 10,
//     margin: 12,
//     paddingHorizontal: 8,
//   },
//   error: {
//     color: "red",
//   },
// });

{
  /* <Text>아이디</Text>
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        value={username}
        onChangeText={handleUsernameChange}
      /> */
}
{
  /* <Controller
        control={control}
        rules={{
          required: "필수 입력입니다",
        }}
        name="username"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            // onChangeText={onChange}
            value={value}
            placeholder="아이디 입력해주세요."
          />
        )}
      />
      {errors.username && (
        <Text style={styles.error}>{errors.username.message}</Text>
      )} */
}
{
  /* <Text>비밀번호</Text>
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        value={password}
        onChangeText={handlePasswordChange}
      /> */
}

{
  /* <View>
        <Pressable onPress={() => getValueFor("access_token")}>
          <Text>결과</Text>
        </Pressable>
      </View> */
}

// const [username, setUsername] = useState<string>("temp1");
// const [password, setPassword] = useState<string>("pass");

// const handleUsernameChange = (inputText: string) => {
// setUsername(inputText);
// };

// const handlePasswordChange = (inputText: string) => {
// setPassword(inputText);
// };

// const schema = z.object({
//   username: z.string().min(4, { message: "아이디가 옳지 않습니다." }),
//   password: z.string().min(4, { message: "비밀번호가 옳지 않습니다." }),
// });

// export default function Index() {
//   // const navigation = useNavigation();

//   const router = useRouter();

//   const postData = async () => {
//     try {
//       const response = await fetch("http://localhost:3000/auth/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           username: `${username}`,
//           password: `${password}`,
//         }),
//       });

//       const data = await response.json();

//       if (data.access_token) {
//         const token = data.access_token;
//         save("access_token", token);
//         router.navigate("/(app)/(tabs)/mainapp");
//       } else {
//         alert("BREAK");
//       }
//     } catch (error) {
//       console.error("Error making POST request:", error);
//     }
//   };

//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<LoginFormData>({
//     resolver: zodResolver(loginSchema),
//   });

//   return (
//     <View style={styles.container}>
//       <Text>아이디</Text>

//       <Controller
//         control={control}
//         name="username"
//         render={({ field: { onChange, onBlur, value } }) => (
//           <TextInput
//             style={styles.input}
//             placeholder="Username"
//             onBlur={onBlur}
//             onChangeText={onChange}
//             value={value}
//           />
//         )}
//       />
//       {errors.username && (
//         <Text style={styles.error}>{errors.username.message}</Text>
//       )}

//       <Text>비밀번호</Text>
//       <Controller
//         control={control}
//         rules={{ required: true, maxLength: 20 }}
//         name="password"
//         render={({ field: { onChange, onBlur, value } }) => (
//           <TextInput
//             style={styles.input}
//             onBlur={onBlur}
//             autoCapitalize="none"
//             onChangeText={onChange}
//             value={value}
//             placeholder="Password"
//           />
//         )}
//       />

//       <View>
//         <Pressable onPress={() => postData()}>
//           <Text>로그인</Text>
//         </Pressable>
//       </View>

//       <View>
//         <Link href="/(auth)/signupScreen">회원가입</Link>
//       </View>
//     </View>
//   );
// }
