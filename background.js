import { AppRegistry } from "react-native";
import { executeTask } from "./src/app/(drawer)/(tabs)/assistant";

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
