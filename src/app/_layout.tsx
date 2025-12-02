import React from "react";

import { Stack } from "expo-router";
import { AppRegistry, useColorScheme } from "react-native";

const emptyHandler = async () => {};

AppRegistry.registerHeadlessTask("BackgroundRunnerTask", () => emptyHandler);

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
