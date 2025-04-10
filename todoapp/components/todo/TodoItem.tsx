import { Pressable, Text, View, StyleSheet } from "react-native";
import { Link } from 'expo-router';
import { TodoItemType } from "@/app/(app)/(tabs)/mainapp";
import { useDeleteNoteItem } from "@/hooks/todos/useDeleteNote";

interface TodoItemPropType {
  item: TodoItemType;
  deleteItem: (id: number) => void;
}

export default function TodoItem({ item, deleteItem }: TodoItemPropType) {
  const onDeleteHandler = () => {
    deleteItem(item.localId);
    useDeleteNoteItem(item.localId);
  };
  // console.log(item.localId);
  return (
    <View style={{ backgroundColor: "blue", margin: 2 }}>
      <Text style={styles.text}>{item.title}</Text>
      <Text>{item.description}</Text>
      <Text>{item.completed || "Not completed"}</Text>
      <Pressable onPress={() => onDeleteHandler()}>
        <Text>삭제</Text>
      </Pressable>
      <Pressable>
        <Link href="/modal">
          <Text>Modal</Text>
        </Link>
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
