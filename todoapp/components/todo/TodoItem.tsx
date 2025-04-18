import { useState } from "react";
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  TextInput,
  Switch,
} from "react-native";
import Button from "../ui/Button";

import { Link } from "expo-router";
import { TodoItemType } from "@/app/(app)/(tabs)/mainapp";
import { deleteTodoRemote } from "@/hooks/todos/deleteTodoRemote";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface TodoItemPropType {
  item: TodoItemType;
  deleteItem: (id: number) => void;
  getLocalNotes: () => void;
}

const EditTodoSchema = z.object({
  title: z
    .string({ required_error: "최소 1글자 이상 입력" })
    .min(1, "최소 1글자 이상 입력"),
  description: z
    .string({ required_error: "최소 1글자 이상 입력" })
    .min(1, "최소 1글자 이상 입력"),
  completed: z.boolean(),
});

type EditTodoFormData = z.infer<typeof EditTodoSchema>;

import * as SQLite from "expo-sqlite";
import { editTodoRemote } from "@/hooks/todos/editTodoRemote";

import Card from "../ui/Card";
import { ThemedText } from "../ThemedText";
import { Colors } from "@/constants/Colors";

export default function TodoItem({
  item,
  deleteItem,
  getLocalNotes,
}: TodoItemPropType) {
  const db = SQLite.useSQLiteContext();

  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditTodoFormData>({
    resolver: zodResolver(EditTodoSchema),
    defaultValues: {
      title: item.title,
      description: item.description,
      completed: item.completed ?? false,
    },
  });

  const onEditHandler = () => {
    setIsEditMode(!isEditMode);
  };

  const onDeleteHandler = () => {
    deleteItem(item.localId);
    deleteTodoRemote(item.localId);
  };

  async function updateLocalNote(id: number, updatedData: EditTodoFormData) {
    try {
      await db.runAsync(
        `UPDATE Todo SET title = ?, description = ?, completed = ? WHERE localId = ?`,
        [
          updatedData.title,
          updatedData.description,
          updatedData.completed ? 1 : 0,
          id,
        ]
      );

      await getLocalNotes();
    } catch (error) {
      console.error("Update failed:", error);
    }
  }

  const onSubmitEdit = async (data: EditTodoFormData) => {
    updateLocalNote(item.localId, {
      title: data.title,
      description: data.description,
      completed: data.completed,
    });
    editTodoRemote({
      localId: item.localId,
      title: data.title,
      description: data.description,
      completed: data.completed,
    });
    setIsEditMode(false);
  };

  const cancelEditHandler = () => {
    reset();
    setIsEditMode(false);
  };

  if (isEditMode === false) {
    return (
      <Card style={{ marginBottom: 10, backgroundColor: "#fff" }}>
        <View>
          <View style={{ marginBottom: 10 }}>
            <ThemedText>완료여부: {item.completed ? "✅" : "❌"}</ThemedText>
            <ThemedText>제목: {item.title}</ThemedText>
            <ThemedText>설명: {item.description}</ThemedText>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 30,
            }}
          >
            <Button style={{ backgroundColor: Colors.light.tint }}>
              <Pressable onPress={() => onDeleteHandler()}>
                <ThemedText style={{ color: "white" }}>삭제</ThemedText>
              </Pressable>
            </Button>
            <Button style={{ backgroundColor: Colors.light.tint }}>
              <Pressable onPress={() => onEditHandler()}>
                <ThemedText style={{ color: "white" }}>수정하기</ThemedText>
              </Pressable>
            </Button>
          </View>
        </View>
      </Card>
    );
  }

  if (isEditMode === true) {
    return (
      <Card style={{ marginBottom: 10, backgroundColor: "#fff" }}>
        <View>
          <View
            style={{
              margin: 2,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <ThemedText style={styles.text}>완료여부: </ThemedText>
            <Controller
              control={control}
              name="completed"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ marginRight: 10 }}>{value ? "✅" : "❌"}</Text>
                  <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={value ? "#f54b8c" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={onChange}
                    value={value}
                  />
                </View>
              )}
            />
          </View>
          <View
            style={{
              margin: 2,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <ThemedText style={styles.text}>제목: </ThemedText>
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
          </View>
          <View
            style={{
              margin: 2,
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <ThemedText style={styles.text}>설명: </ThemedText>
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="설명"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  autoCapitalize="none"
                  value={value}
                />
              )}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 20,
            }}
          >
            <Button style={{ backgroundColor: Colors.light.tint }}>
              <Pressable onPress={handleSubmit(onSubmitEdit)}>
                <ThemedText style={{ color: "white" }}>
                  수정 완성하기
                </ThemedText>
              </Pressable>
            </Button>
            <Button style={{ backgroundColor: Colors.light.tint }}>
              <Pressable onPress={() => cancelEditHandler()}>
                <ThemedText style={{ color: "white" }}>취소하기</ThemedText>
              </Pressable>
            </Button>
          </View>
        </View>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 200,
  },
  text: {
    color: "black",
  },

  input: {
    width: 300,
    height: 32,
    borderWidth: 2,
    borderColor: "#ccc",
    paddingHorizontal: 5,
    borderRadius: 6,
  },
});

// <Link
//   href={{
//     pathname: "/modal",
//     params: {
//       itemId: item.localId,
//       title: item.title,
//       description: item.description,
//       completed: item.completed,
//     },
//   }}
// >
//   <Text>수정하기</Text>
// </Link>;
