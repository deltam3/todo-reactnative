import {
  Text,
  View,
  ActivityIndicator,
  TextInput,
  StyleSheet,
  Pressable,
  FlatList,
  SafeAreaView,
  ScrollView,
  Platform,
} from "react-native";

import * as SecureStore from "expo-secure-store";
import { Redirect } from "expo-router";
import useCheckLoginStatus from "@/hooks/useCheckLoginStatus";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTodos } from "@/hooks/todos/useGetTodo";

const AddTodoSchema = z.object({
  title: z
    .string({ required_error: "최소 1글자 이상 입력" })
    .min(1, "최소 1글자 이상 입력"),
  description: z
    .string({ required_error: "최소 1글자 이상 입력" })
    .min(1, "최소 1글자 이상 입력"),
});

type TodoFormData = z.infer<typeof AddTodoSchema>;

export interface TodoItemType {
  cloudId?: number;
  localId: number;
  title: string;
  description: string;
  completed?: boolean;
  lastModified?: Date;
}

import React, { useCallback, useEffect, useMemo, useState } from "react";
import TodoItem from "@/components/todo/TodoItem";

import * as SQLite from "expo-sqlite";
import { addTodoRemote, useAddTodo } from "@/hooks/todos/addTodoRemote";
import Button from "@/components/ui/Button";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { act } from "@testing-library/react-native";

import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
const { API_URL } = Constants.expoConfig.extra;

export default function MainApp() {
  const isAuthenticated = useCheckLoginStatus();

  const { fetchedTodos, isPending } = useTodos();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TodoFormData>({
    resolver: zodResolver(AddTodoSchema),
  });
  const [todos, setTodos] = useState<TodoItemType[]>();

  const hasSyncedRef = React.useRef(false);

  const db = SQLite.useSQLiteContext();

  // React.useEffect(() => {
  //   if (!fetchedTodos) return;
  //   const syncData = async () => {
  //     try {
  //       // sqlite 초기화
  //       await db.execAsync(`
  //         DROP TABLE IF EXISTS Todo;
  //         CREATE TABLE IF NOT EXISTS Todo (
  //         localId INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  //         title TEXT NOT NULL,
  //         description TEXT NOT NULL,
  //         completed BOOLEAN NOT NULL DEFAULT 0
  //       );`);
  //     } catch (dbError) {
  //       console.error("Error initializing SQLite:", dbError);
  //     }

  //     try {
  //       // Construct the INSERT statements
  //       const insertQueries = fetchedTodos
  //         .map(
  //           (todo: TodoItemType) => `
  //         INSERT INTO Todo (localId, title, description, completed)
  //         VALUES ('${todo.localId}','${todo.title}', '${todo.description}', ${todo.completed});
  //       `
  //         )
  //         .join(" ");

  //       // Execute the bulk insert
  //       await db.execAsync(`
  //         ${insertQueries}
  //       `);

  //       await getLocalNotes();
  //     } catch (error) {}
  //   };

  //   syncData();
  // }, [fetchedTodos]);

  React.useEffect(() => {
    if (hasSyncedRef.current) return;

    const syncData = async () => {
      try {
        await db.execAsync(`
        DROP TABLE IF EXISTS Todo;
        CREATE TABLE IF NOT EXISTS Todo (
        localId INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        completed BOOLEAN NOT NULL DEFAULT 0
      );`);
      } catch (dbError) {
        console.error("Error initializing SQLite:", dbError);
      }

      try {
        const insertQueries = fetchedTodos
          .map(
            (todo: TodoItemType) => `
        INSERT INTO Todo (localId, title, description, completed)
        VALUES ('${todo.localId}', '${todo.title}', '${todo.description}', ${todo.completed});
      `
          )
          .join(" ");

        await db.execAsync(`${insertQueries}`);
        await getLocalNotes();

        hasSyncedRef.current = true;
      } catch (error) {
        console.error("Error inserting data:", error);
      }
    };

    syncData();
  }, [fetchedTodos]);

  async function getLocalNotes() {
    try {
      const result = (await db.getAllAsync(
        `SELECT * FROM Todo`
      )) as TodoItemType[];
      setTodos(result);
    } catch (error) {
      console.error("getLocalNotes error:", error);
    }
  }

  async function createLocalNote(note: any): Promise<number | undefined> {
    let lastInsertedId: number | undefined;

    try {
      await db.withTransactionAsync(async () => {
        const result = await db.runAsync(
          `INSERT INTO Todo (title, description) VALUES (?, ?)`,
          [note.title, note.description]
        );

        lastInsertedId = result.lastInsertRowId;
      });

      await getLocalNotes();

      return lastInsertedId;
    } catch (error) {
      console.error("Error creating local note:", error);
      return undefined;
    }
  }

  async function deleteLocalNote(id: number) {
    db.withTransactionAsync(async () => {
      await db.runAsync(`DELETE FROM Todo WHERE localId = ?`, [id]);
      await getLocalNotes();
    });
  }

  const onPressSubmit = async (data: TodoFormData) => {
    const firstTemp = { title: data.title, description: data.description };
    const insertedId = await createLocalNote(firstTemp);

    const temp = {
      title: data.title,
      description: data.description,
      localId: insertedId,
    } as TodoItemType;
    addTodoRemote(temp);

    reset();
  };

  if (isAuthenticated === null) {
    return <ActivityIndicator size="large" color="#00ff00" />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/loginScreen" />;
  }
  if (isPending) {
    return <ActivityIndicator size="large" color="#00ff00" />;
  }

  return (
    // <ThemedView style={{ paddingHorizontal: 8, paddingTop: 16, flex: 1 }}>
    <ThemedView style={styles.safeArea}>
      <Text style={{ textAlign: "center" }}>노트 어플</Text>

      <View style={{ marginBottom: 16 }}>
        <ThemedText>제목</ThemedText>
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="제목"
              onBlur={onBlur}
              onChangeText={onChange}
              autoCapitalize="none"
              value={value}
            />
          )}
        />
        {errors.title && (
          <ThemedText style={styles.error}>{errors.title.message}</ThemedText>
        )}

        <ThemedText>내용</ThemedText>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="설명"
              autoCapitalize="none"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.description && (
          <ThemedText style={styles.error}>
            {errors.description.message}
          </ThemedText>
        )}
        <Button style={{ backgroundColor: Colors.light.tint }}>
          <Pressable onPress={handleSubmit(onPressSubmit)}>
            {/* <ThemedText style={{ color: "white", fontWeight: "bold" }}> */}
            <ThemedText
              style={{
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              추가
            </ThemedText>
          </Pressable>
        </Button>
      </View>

      <FlatList
        data={todos}
        keyExtractor={(item) => item.localId.toString()}
        renderItem={({ item }: any) => (
          <TodoItem
            item={item}
            deleteItem={deleteLocalNote}
            getLocalNotes={getLocalNotes}
          />
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: 24,
    paddingHorizontal: 8,
  },
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
