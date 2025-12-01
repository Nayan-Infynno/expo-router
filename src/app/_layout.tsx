import React from "react";

import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

// ReactNativeBackgroundRunnerModule.setBackgroundHandler(
//   async ({ parameters }) => {
//     console.log("Cold-start background handler received", parameters);
//     await ReactNativeBackgroundRunnerModule.updateNotification({
//       taskDesc: "Headless running...",
//     });
//     await new Promise((res) => setTimeout(res, 5000));
//     await ReactNativeBackgroundRunnerModule.updateNotification({
//       taskDesc: "Headless done",
//     });
//     await ReactNativeBackgroundRunnerModule.stop();
//   }
// );

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
