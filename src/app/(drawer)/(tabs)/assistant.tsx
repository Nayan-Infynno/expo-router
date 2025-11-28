import ReactNativeBackgroundRunnerModule from "@/modules/react-native-background-runner/src/ReactNativeBackgroundRunnerModule";
import { ThemedView } from "@/src/components/themed-view";
import React from "react";
import { Button, StyleSheet } from "react-native";

const sleep = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

const Assistant = () => {
  const options = {
    taskName: "Example",
    taskTitle: "ExampleTask title",
    taskDesc: "ExampleTask description",
    taskIcon: {
      name: "ic_launcher",
      type: "mipmap",
    },
    color: "#ff00ff",
    linkingURI: "yourSchemeHere://chat/jane",
    parameters: {
      delay: 1000,
      data: {},
    },
  };

  const onRunningProcess = async ({ parameters }: any) => {
    const { delay } = parameters;

    // Delay / work loop
    await sleep(delay);

    // API call
    fetch("https://jsonplaceholder.typicode.com/todos/1")
      .then((response) => response.json())
      .then((json) => console.log(json));

    // Update notification
    await ReactNativeBackgroundRunnerModule.updateNotification({
      taskDesc: "Task completed successfully!",
    });

    // Stop native background service
    await ReactNativeBackgroundRunnerModule.stop();
  };

  const onPressBackgroundAction = async () => {
    try {
      await ReactNativeBackgroundRunnerModule.start(onRunningProcess, options);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Button
        title="Start Background Process"
        onPress={onPressBackgroundAction}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Assistant;
