import AsyncStorage from "@react-native-async-storage/async-storage";
import { Todo } from "../types/todo";

const STORAGE_KEY = "@todos";

export const getTodos = async (): Promise<Todo[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Error reading todos:", e);
    return [];
  }
};

export const saveTodos = async (todos: Todo[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(todos);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error("Error saving todos:", e);
  }
};

export const addTodo = async (
  todo: Omit<Todo, "id" | "createdAt">,
): Promise<void> => {
  const todos = await getTodos();
  const newTodo: Todo = {
    ...todo,
    id: Date.now().toString(),
    createdAt: Date.now(),
  };
  await saveTodos([...todos, newTodo]);
};

export const updateTodo = async (
  id: string,
  updates: Partial<Todo>,
): Promise<void> => {
  const todos = await getTodos();
  const updatedTodos = todos.map((todo) =>
    todo.id === id ? { ...todo, ...updates } : todo,
  );
  await saveTodos(updatedTodos);
};

export const deleteTodo = async (id: string): Promise<void> => {
  const todos = await getTodos();
  const filteredTodos = todos.filter((todo) => todo.id !== id);
  await saveTodos(filteredTodos);
};
