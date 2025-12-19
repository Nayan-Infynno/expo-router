import { useThemeColor } from "@/src/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { useColorScheme } from "react-native";

const AnimationLayout = () => {
  const router = useRouter();
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
        headerLeft: () => (
          <Ionicons
            name="chevron-back-outline"
            size={24}
            color={textColor}
            style={{
              padding: 6,
              borderRadius: 100,
            }}
            onPress={() => router.back()}
            suppressHighlighting={true}
          />
        ),
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Contact List",
        }}
      />
      <Stack.Screen
        name="animatedBar"
        options={{
          title: "Animated Bar",
        }}
      />
      <Stack.Screen
        name="scrollViewDemo"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Menu"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default AnimationLayout;
