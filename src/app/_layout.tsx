import React from "react";

import { Stack } from "expo-router";
import { AppRegistry, useColorScheme } from "react-native";
import { executeTask } from "./(drawer)/(tabs)/assistant";

// your headless handler
async function myScheduledHandler({ parameters }: any) {
  if (parameters?.runningOn === "SCHEDULE_TASK") {
    console.log("HANDLESS TASK IN _LAYOUT FILE CODE : ", parameters);
    executeTask(parameters, false);
  }
}

AppRegistry.registerHeadlessTask(
  "BackgroundRunnerTask",
  () => myScheduledHandler
);

const _layout = () => {
  const colorScheme = useColorScheme();
  return (
    <Stack
      screenOptions={{
        statusBarStyle: colorScheme === "dark" ? "light" : "dark",
        headerShown: false,
      }}
    >
      <Stack.Screen name="(auth)/signin" />
      <Stack.Screen name="(auth)/signup" />
      <Stack.Screen name="(drawer)/" options={{ headerShown: false }} />
    </Stack>
  );
};

export default _layout;
