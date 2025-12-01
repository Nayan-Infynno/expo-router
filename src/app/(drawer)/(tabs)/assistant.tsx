import BackgroundRunner from "@/modules/react-native-background-runner/src/ReactNativeBackgroundRunnerModule";
import React from "react";
import { Button, StyleSheet, View } from "react-native";

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

const options = {
  taskName: "ExampleBackground",
  taskTitle: "Example Running",
  taskDesc: "Preparing...",
  taskIcon: { name: "ic_launcher", type: "mipmap" },
  color: "#ff00ff",
  linkingURI: "expopilot://assistant",
  parameters: { delay: 1000, data: {} },
};

export default function Assistant() {
  const onRunningProcess = async ({ parameters }: any) => {
    const { delay } = parameters;
    // 3 stages
    const stages = [
      { id: 1, label: "Stage 1: Gather", duration: 5000 },
      { id: 2, label: "Stage 2: Process", duration: 5000 },
      { id: 3, label: "Stage 3: Finalize", duration: 5000 },
    ];

    for (const s of stages) {
      await BackgroundRunner.updateNotification({ taskDesc: s.label });
      const loops = Math.max(1, Math.floor(s.duration / delay));
      for (let i = 0; i < loops; i++) {
        await sleep(delay);
      }
    }

    await BackgroundRunner.updateNotification({ taskDesc: "Completed" });
    await BackgroundRunner.stop();
  };

  const onPress = async () => {
    try {
      await BackgroundRunner.start(onRunningProcess, options);
    } catch (e) {
      console.error("Start error", e);
    }
  };

  const onScheduledTask = async ({ parameters }: any) => {
    console.log("⏰ Scheduled Task Triggered!", parameters);

    // Example background work
    for (let i = 0; i < 10; i++) {
      console.log("Running step", i);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Update notification
    await BackgroundRunner.updateNotification({
      taskDesc: "Scheduled Task Finished!",
    });

    // Stop service
    await BackgroundRunner.stop();
  };

  const onPressSchedule = async () => {
    try {
      // First register default (headless-style) handler
      BackgroundRunner.registerDefault(onScheduledTask);
      const hour = 16; // 4 PM India
      const minute = 52;

      await BackgroundRunner.scheduleDaily(hour, minute, {
        taskName: "DailyTask",
        taskTitle: "Daily Task Running",
        taskDesc: "Your scheduled task is executing",
        taskIcon: { name: "ic_launcher", type: "mipmap" },
        color: "#ff0000",
        linkingURI: "expopilot://assistant",
        parameters: {
          delay: 1000,
          data: { message: "Hello from schedule" },
        },
      });

      alert("Scheduled for today at 4:48 PM!");
    } catch (e) {
      console.error("Schedule error", e);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Start Background" onPress={onPress} />
      <Button title="schedule Background" onPress={onPressSchedule} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});
