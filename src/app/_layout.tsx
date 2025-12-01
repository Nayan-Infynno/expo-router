import React from "react";

import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

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
