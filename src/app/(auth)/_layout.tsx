import React from "react";

import { useThemeColor } from "@/src/hooks/use-theme-color";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

const AuthLayout = () => {
  const colorScheme = useColorScheme();
  const headerBackgroundColor = useThemeColor({}, "backgroundColor");
  const textColor = useThemeColor({}, "textColor");

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: headerBackgroundColor,
        },
        headerTitleStyle: {
          color: textColor,
          fontSize: 22,
        },
        headerTintColor: textColor,
        statusBarStyle: colorScheme === "dark" ? "light" : "dark",
        headerBackButtonDisplayMode: "minimal",
        headerTitleAlign: "center",
        // headerLeft: () => (
        //   <Ionicons
        //     name="chevron-back-outline"
        //     size={24}
        //     color={textColor}
        //     style={{
        //       padding: 6,
        //       borderRadius: 100,
        //     }}
        //     onPress={() => router.back()}
        //     suppressHighlighting={true}
        //   />
        // ),
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Splash",
        }}
      />
      <Stack.Screen
        name="signin/index"
        options={{
          title: "Sign In",
        }}
      />
      <Stack.Screen name="signup/index" options={{ title: "Sign Up" }} />
    </Stack>
  );
};

export default AuthLayout;
