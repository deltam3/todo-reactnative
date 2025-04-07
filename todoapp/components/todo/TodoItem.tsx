import { Pressable, Text, View, StyleSheet } from "react-native";

import { TodoItemType } from "@/app/(app)/mainapp";

interface TodoItemPropType {
  item: TodoItemType;
  deleteItem: (id: number) => void;
}

export default function TodoItem({ item, deleteItem }: TodoItemPropType) {
  const onDeleteHandler = () => {
    deleteItem(item.id);
  };

  return (
    <View style={{ backgroundColor: "blue", margin: 2 }}>
      <Text style={styles.text}>{item.title}</Text>
      <Text>{item.description}</Text>
      <Text>{item.completed || "Not completed"}</Text>
      <Pressable onPress={() => onDeleteHandler()}>
        <Text>삭제</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 200,
  },
  text: {
    color: "black",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
