import React from "react";
import { StyleSheet } from "react-native";

import ExpoBackgroundTaskManagerModule from "@/modules/expo-background-task-manager/src/ExpoBackgroundTaskManagerModule";
import { ThemedText } from "@/src/components/themed-text";
import { ThemedView } from "@/src/components/themed-view";
import { Link } from "expo-router";
import { Button } from "react-native-paper";

const TASK_NAME = "com.expopilot.backgroundTask";

const Home = () => {
  const startBackgroundTask = async () => {
    try {
      ExpoBackgroundTaskManagerModule.start({
        title: "Background Running",
        message: "Processing your data...",
        interval: 5000,
      });
      // Start the APIS Integration
    } catch (e) {
      console.log("Error registering task:", e);
    }
  };

  const runNow = async () => {
    try {
      ExpoBackgroundTaskManagerModule.updateNotification({
        title: "Still Running",
        message: "Updated from JS",
      });
    } catch (e) {
      console.log(e);
    }
  };

  const stopBackgroundTask = async () => {
    try {
      ExpoBackgroundTaskManagerModule.stop();
    } catch (e) {
      console.log("Error unregistering task:", e);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Link href="/(screen)/list">
        <ThemedText>List listing & Slot Layout</ThemedText>
      </Link>
      <Link href="/(screen)/product">
        <ThemedText>Product listing (id & catch all)</ThemedText>
      </Link>
      <Link href="/profile/john">
        <ThemedText>John Profile (Custom Not found)</ThemedText>
      </Link>
      {/* Start periodic background task */}
      <Button onPress={startBackgroundTask}>Start Background Task</Button>
      {/* Force run once right now */}
      <Button style={{ marginTop: 10 }} onPress={runNow}>
        Run Now (Android)
      </Button>
      <Button style={{ marginTop: 10 }} onPress={stopBackgroundTask}>
        Stop
      </Button>
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

export default Home;
