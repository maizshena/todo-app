import React, { useEffect, useState } from "react";
import {
    FlatList,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import AddTaskModal from "../components/AddTaskModal";
import TodoItem from "../components/TodoItem";
import { Colors } from "../constants/Colors";
import { Todo } from "../types/todo";
import { addTodo, deleteTodo, getTodos, updateTodo } from "../utils/storage";

export default function Index() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    const loadedTodos = await getTodos();
    setTodos(loadedTodos.sort((a, b) => b.createdAt - a.createdAt));
  };

  const handleAddTask = () => {
    setEditingTodo(null);
    setModalVisible(true);
  };

  const handleEditTask = (todo: Todo) => {
    setEditingTodo(todo);
    setModalVisible(true);
  };

  const handleSaveTask = async (title: string, description: string) => {
    if (editingTodo) {
      await updateTodo(editingTodo.id, { title, description });
    } else {
      await addTodo({ title, description, completed: false });
    }
    await loadTodos();
  };

  const handleToggleComplete = async (todo: Todo) => {
    await updateTodo(todo.id, { completed: !todo.completed });
    await loadTodos();
  };

  const handleDeleteTask = async (id: string) => {
    await deleteTodo(id);
    await loadTodos();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Tasks</Text>
        <Text style={styles.headerSubtitle}>
          {todos.filter((t) => !t.completed).length} pending
        </Text>
      </View>

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TodoItem
            todo={item}
            onToggle={() => handleToggleComplete(item)}
            onEdit={() => handleEditTask(item)}
            onDelete={() => handleDeleteTask(item.id)}
          />
        )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tasks yet</Text>
            <Text style={styles.emptySubtext}>
              Tap the + button to add a task
            </Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.fab} onPress={handleAddTask}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <AddTaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveTask}
        editingTodo={editingTodo}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 24,
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    fontSize: 32,
    color: Colors.white,
    fontWeight: "300",
  },
});
