import { useThemeColor } from "@/src/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { useColorScheme } from "react-native";

const ScreenLayout = () => {
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
        name="list/index"
        options={{
          title: "List",
        }}
      />
      <Stack.Screen
        name="list/[id]"
        options={{
          title: "List Details",
        }}
      />
      <Stack.Screen
        name="product/index"
        options={{
          title: "Product Listing",
        }}
      />
      <Stack.Screen
        name="product/[id]"
        options={{
          title: "Product Details",
        }}
      />
      <Stack.Screen
        name="product/[...rest]"
        options={{
          title: "Catch All Product Details",
        }}
      />
      <Stack.Screen
        name="+not-found/index"
        options={{
          headerShown: false,
          title: "File Not Found",
        }}
      />
    </Stack>
  );
};

export default ScreenLayout;
