import * as Notifications from "expo-notifications";
import { AppRegistry } from "react-native";
import { executeTask } from "./src/app/(drawer)/(tabs)/assistant";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// 🔥 Listener: App is OPEN (foreground)
Notifications.addNotificationReceivedListener((notification) => {
  console.log("📩 FOREGROUND notification received:", notification);
  executeTask({}, false);
});

// 🔥 Listener: User taps notification (background OR killed)
Notifications.addNotificationResponseReceivedListener((response) => {
  console.log("📩 Notification clicked (background/killed):", response);
});

// your headless handler
async function myScheduledHandler({ parameters }) {
  console.log("HANDLESS TASK IN BACKGROUND FILE CODE : ", parameters);
  if (parameters?.runningOn === "SCHEDULE_TASK") {
    console.log("HANDLESS TASK IN _LAYOUT FILE CODE : ", parameters);
    executeTask(parameters, false);
  }
}

AppRegistry.registerHeadlessTask(
  "BackgroundRunnerTask",
  () => myScheduledHandler
);
