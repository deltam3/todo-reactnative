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
  cloudId?: number;
  localId: number;
  title: string;
  description: string;
  completed?: boolean;
  lastModified?: Date;
}

import { useAddTodo } from "@/hooks/todos/useAddTodo";
import useCheckLoginStatus from "@/hooks/useCheckLoginStatus";
import { useQueryClient } from "@tanstack/react-query";
import { Redirect } from "expo-router";

export default function Index() {
  const isAuthenticated = useCheckLoginStatus();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/loginScreen" />;
  }
  const [title, setTitle] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [todos, setTodos] = useState<TodoItemType[]>();
  const { data, isPending } = useTodos();

  const db = SQLite.useSQLiteContext();

  const handleTitleChange = (inputText: string) => {
    setTitle(inputText);
  };

  const handleDescriptionChange = (inputText: string) => {
    setDescription(inputText);
  };

  // 초기화 작업
  React.useEffect(() => {
    if (!data) return; 
    const syncData = async () => {
      try {
        // sqlite 초기화
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
        // Construct the INSERT statements

        const insertQueries = data
          .map(
            (todo: TodoItemType) => `
          INSERT INTO Todo (localId, title, description, completed)
          VALUES ('${todo.localId}','${todo.title}', '${todo.description}', ${todo.completed});
        `
          )
          .join(" ");
        
        // Execute the bulk insert
        await db.execAsync(`
          ${insertQueries}
        `);
        // console.log(data)
        await getLocalNotes();
      } catch (error) {
       
      }
    };
    
    syncData();
  }, [data] );

  async function getLocalNotes() {
    try {

      const result = (await db.getAllAsync(
        `SELECT * FROM Todo`
      )) as TodoItemType[];
      console.log("LOCAL SAVED DB: " + result);
      setTodos(result);
    } catch (error) {
      console.error("getLocalNotes error:", error);
    }
  }

  // async function createLocalNote(note: any) {
  //   try {
  //     const outerResult = await db.withTransactionAsync(async () => {
  //       const result = await db.runAsync(
  //         `INSERT INTO Todo (title, description) VALUES (?, ?,)`,
  //         [note.title, note.description]
  //       );

  //       await getLocalNotes();
  //       return result.lastInsertRowId;
  //     });

  //     const finalResult = await outerResult;
  //     await getLocalNotes();
  //     return finalResult;
  //   } catch (error) {
  //     console.error("Error creating local note:", error);
  //   }
  // }
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

      return lastInsertedId; // Return the last inserted ID
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

  const onPressSubmit = async () => {
    const firstTemp = { title, description };
    const insertedId = await createLocalNote(firstTemp);
    
    const temp = {
      title: title,
      description: description,
      localId: insertedId,
    } as TodoItemType;
      useAddTodo(temp);

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
        keyExtractor={(item) => item.localId.toString() || Math.random()}
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

// async function deleteAllLocalNotes() {
//   db.withTransactionAsync(async () => {
//     await db.runAsync(`DELETE FROM Todo`);
//     await getLocalNotes();
//   });
// }

// PRAGMA journal_mode = WAL;user

// React.useEffect(() => {
//   if (todos === undefined) {
//     return;
//   }
//   const data = todos as TodoItemType[];
//   useUploadTodos(data);
// }, [todos]);
