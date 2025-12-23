// src/utils/todoStorage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const TODO_KEY = "APP_TODOS";

export const saveTodos = async (todos: any[]) => {
  try {
    await AsyncStorage.setItem(TODO_KEY, JSON.stringify(todos));
  } catch (e) {
    console.log("Save todos error", e);
  }
};

export const loadTodos = async () => {
  try {
    const data = await AsyncStorage.getItem(TODO_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.log("Load todos error", e);
    return [];
  }
};
