import {
  Text,
  View,
  ActivityIndicator,
  FlatList,
  TextInput,
  StyleSheet,
  Pressable,
} from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import * as SQLite from "expo-sqlite";
import TodoItem from "@/components/todo/TodoItem";
import { useUploadTodos } from "@/hooks/todos/useUploadTodos";
import { useTodos } from "@/hooks/todos/useGetTodo";

export interface TodoItemType {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  lastModified?: Date;
}

import useCheckLoginStatus from "@/hooks/useCheckLoginStatus";

export default function Index() {
  // const isAuthenticated = useCheckLoginStatus();

  // if (!isAuthenticated) {
  //   return <Redirect href="/(auth)/loginScreen" />;
  // }
  const [title, setTitle] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [todos, setTodos] = useState<TodoItemType[]>();
  const { data } = useTodos();

  const db = SQLite.useSQLiteContext();

  const handleTitleChange = (inputText: string) => {
    setTitle(inputText);
  };

  const handleDescriptionChange = (inputText: string) => {
    setDescription(inputText);
  };

  React.useEffect(() => {
    const syncData = async () => {
      try {
        await db.execAsync(`CREATE TABLE IF NOT EXISTS Todo (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          completed BOOLEAN NOT NULL DEFAULT 0
        );`);
        getLocalNotes();
      } catch (dbError) {
        console.error("Error initializing SQLite:", dbError);
      }

      try {
        // Cloud DB sync
        setTodos(data);
      } catch (error) {
        // console.error("Error syncing with cloud DB:", error);
      }
    };

    syncData();
  }, []);

  React.useEffect(() => {
    if (todos === undefined) {
      return;
    }
    const data = todos as TodoItemType[];
    useUploadTodos(data);
  }, [todos]);

  async function getLocalNotes() {
    try {
      const result = (await db.getAllAsync(
        `SELECT * FROM Todo`
      )) as TodoItemType[];
      setTodos(result);
    } catch {}
  }

  async function createLocalNote(note: any) {
    try {
      await db.withTransactionAsync(async () => {
        await db.runAsync(
          `INSERT INTO Todo (title, description) VALUES (?, ?)`,
          [note.title, note.description]
        );
        await getLocalNotes();
      });
    } catch (error) {
      console.error("Error creating local note:", error);
    }
  }

  async function deleteLocalNote(id: number) {
    db.withTransactionAsync(async () => {
      await db.runAsync(`DELETE FROM Todo WHERE id = ?`, [id]);
      await getLocalNotes();
    });
  }

  async function deleteAllLocalNotes() {
    db.withTransactionAsync(async () => {
      await db.runAsync(`DELETE FROM Todo`);
      await getLocalNotes();
    });
  }

  const onPressSubmit = () => {
    const temp = { title: title, description: description };
    createLocalNote(temp);
    setTitle("");
    setDescription("");
  };

  return (
    <View>
      <Text style={{ textAlign: "center" }}>노트 어플</Text>
      <View>
        <Text>제목</Text>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          value={title}
          onChangeText={handleTitleChange}
        />
        <Text>설명</Text>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          value={description}
          onChangeText={handleDescriptionChange}
        />
        <Pressable onPress={onPressSubmit}>
          <Text style={{ textAlign: "center" }}>추가</Text>
        </Pressable>
      </View>

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }: any) => (
          <TodoItem item={item} deleteItem={deleteLocalNote} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 200,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
