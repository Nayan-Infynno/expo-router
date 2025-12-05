import BackgroundRunner from "@/modules/react-native-background-runner/src/ReactNativeBackgroundRunnerModule";
import React, { useEffect } from "react";
import { Button, StyleSheet, View } from "react-native";

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

const optionForBackground = {
  taskName: "ExampleBackground",
  taskTitle: "Example Running",
  taskDesc: "Preparing...",
  taskIcon: { name: "ic_launcher", type: "mipmap" },
  color: "#ff00ff",
  linkingURI: "expopilot://assistant",
  parameters: { delay: 1000, runningOn: "BACKGROUND_TASK" },
};

const optionForSchedule = {
  taskName: "DailyTask",
  taskTitle: "Daily Task Running",
  taskDesc: "Executing scheduled task...",
  taskIcon: { name: "ic_launcher", type: "mipmap" },
  color: "#ff0000",
  linkingURI: "expopilot://assistant",
  parameters: {
    delay: 1000,
    data: { message: "Hello from schedule" },
    runningOn: "SCHEDULE_TASK",
  },
};

// Common background logic for both foreground + scheduled
export async function executeTask(parameters: any, isHeadless: boolean) {
  console.log("🚀 Task Triggered!", parameters);

  for (let i = 0; i < 10; i++) {
    console.log("Running step", i);
    await sleep(1000);
  }

  await BackgroundRunner.updateNotification({
    taskDesc: "Task Finished!",
  });

  // ❗Headless mode me stop() immediately not recommended
  if (!isHeadless) {
    await BackgroundRunner.stop();
  }
}

export default function Assistant() {
  useEffect(() => {
    const subscription = BackgroundRunner.addListener(
      "onNotificationReceivedIOS",
      (data: any) => {
        console.log("🔥 Notification Event:", data);
      }
    );

    // cleanup when screen unmount
    return () => subscription.remove();
  }, []);

  const onRunningProcess = async ({ parameters }: any) => {
    return executeTask(parameters, false);
  };

  const onPress = async () => {
    try {
      await BackgroundRunner.start(onRunningProcess, optionForBackground);
    } catch (e) {
      console.error("Start error", e);
    }
  };

  const onPressSchedule = async () => {
    try {
      const hour = 14; // 7 PM
      const minute = 51;

      await BackgroundRunner.scheduleDaily(hour, minute, optionForSchedule);

      alert("Scheduled successfully!");
    } catch (e) {
      console.error("Schedule error", e);
    }
  };

  const onPressAutoStartPermission = async () => {
    try {
      await BackgroundRunner.openAutoStartSettings();
    } catch (e) {
      console.error("Auto start permission error", e);
    }
  };

  const onPressScheduleIOS = async () => {
    try {
      const hour = 12; // 7 PM
      const minute = 40;

      const options = {
        title: "Good Morning nyn",
        message: "Your daily job is ready!",
      };

      await BackgroundRunner.scheduleDailyIOS(hour, minute, options);

      alert(`Scheduled successfully!`);
    } catch (e) {
      console.error("Schedule error", e);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Start Background" onPress={onPress} />
      <Button title="Schedule Background" onPress={onPressSchedule} />
      <Button title="Take Permission" onPress={onPressAutoStartPermission} />
      <Button title="Schedule Daily IOS" onPress={onPressScheduleIOS} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});
