import { ThemedText } from "@/src/components/themed-text";
import { ThemedView } from "@/src/components/themed-view";
import { loadTodos, saveTodos } from "@/src/helper/storage";
import { ExtensionStorage } from "@bacons/apple-targets";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  AppState,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Button } from "react-native-paper";

interface todoTypes {
  id: string;
  todo: string;
  isDone: boolean;
}

const storage = new ExtensionStorage("group.krunalinfynno.ExpoPilot");
const STORAGE_KEY = "widget_todos";

const index = () => {
  const [todo, setTodo] = React.useState<string>("");
  const [todos, setTodos] = React.useState<todoTypes[]>([]);

  React.useEffect(() => {
    const fetchTodos = async () => {
      const storedTodos = await loadTodos();
      storage.set(STORAGE_KEY, storedTodos);
      console.log("GETTTTT  ", storedTodos);
      setTodos(storedTodos);
    };

    fetchTodos();
  }, []);

  React.useEffect(() => {
    console.log("Set --", todos);
    saveTodos(todos);
    storage.set(STORAGE_KEY, todos);
  }, [todos]);

  React.useEffect(() => {
    // use background
    AppState.addEventListener("change", (status) => {
      if (status === "background") {
        ExtensionStorage.reloadWidget();
        console.log("reload widget");
      }
    });
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.todoContainer}>
        <ThemedView style={{ paddingHorizontal: 16 }}>
          <ThemedText>Enter the todos</ThemedText>
          <ThemedView style={{ flexDirection: "row", marginTop: 8 }}>
            <TextInput
              placeholder="Enter todos"
              style={styles.todoInput}
              value={todo}
              onChangeText={setTodo}
            />
            <Button
              mode="contained"
              style={styles.submitButton}
              disabled={!todo.length}
              onPress={() => {
                if (todo.length) {
                  const updateTodo = {
                    id: Date.now(),
                    todo,
                    isDone: false,
                  };
                  const updateTodos = [...todos, updateTodo];
                  setTodos(updateTodos);
                  setTodo("");
                  storage.set(STORAGE_KEY, updateTodos);
                }
              }}
            >
              Submit
            </Button>
          </ThemedView>
        </ThemedView>

        {todos.length > 0 && (
          <ThemedView style={styles.listContainer}>
            <ThemedText style={{ paddingHorizontal: 16 }}>Todo List</ThemedText>
            <ScrollView
              contentContainerStyle={{
                marginTop: 8,
                paddingHorizontal: 16,
              }}
            >
              {todos.map((todo, index) => {
                let findTodos = todos.find((todos) => todos.id === todo.id);

                return (
                  <ThemedView
                    key={index}
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      marginVertical: 2,
                    }}
                  >
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => {
                        if (findTodos) {
                          findTodos.isDone = !findTodos.isDone;
                          setTodos([...todos]);
                          storage.set(STORAGE_KEY, [...todos]);
                        }
                      }}
                    >
                      <ThemedView
                        style={{
                          borderWidth: 2,
                          height: 20,
                          width: 20,
                          borderRadius: 4,
                          marginRight: 8,
                        }}
                      >
                        {todo?.isDone && (
                          <Ionicons
                            name="checkmark-outline"
                            size={16}
                            color={"#000"}
                          />
                        )}
                      </ThemedView>
                    </TouchableOpacity>
                    <ThemedText
                      suppressHighlighting={true}
                      onPress={() => {
                        if (findTodos) {
                          findTodos.isDone = !findTodos.isDone;
                          setTodos([...todos]);
                          storage.set(STORAGE_KEY, [...todos]);
                        }
                      }}
                      style={{
                        textDecorationLine: findTodos?.isDone
                          ? "line-through"
                          : "none",
                        flex: 1,
                      }}
                    >
                      {index + 1}. {todo.todo}
                    </ThemedText>
                    <ThemedView style={{ marginLeft: 8 }}>
                      <Ionicons
                        onPress={() => {
                          if (findTodos) {
                            setTodos((prev: todoTypes[]) => {
                              return prev.filter(
                                (todo) => todo.id !== findTodos.id
                              );
                            });
                          }
                        }}
                        name="trash-bin"
                        color={"#444343ff"}
                        size={16}
                      />
                    </ThemedView>
                  </ThemedView>
                );
              })}
            </ScrollView>
          </ThemedView>
        )}
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  todoContainer: {
    paddingVertical: 8,
  },
  todoInput: {
    flex: 1,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderColor: "#ccc",
  },
  submitButton: {
    marginLeft: 8,
  },
  listContainer: {
    marginTop: 16,
  },
});

export default index;
