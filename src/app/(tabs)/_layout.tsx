import React from "react";
import { Text, useColorScheme } from "react-native";

import { HapticTab } from "@/src/components/haptic-tab";
import { useThemeColor } from "@/src/hooks/use-theme-color";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

const TabLayout = () => {
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({}, "dropDownColor");
  const headerBackgroundColor = useThemeColor({}, "backgroundColor");
  const textColor = useThemeColor({}, "textColor");

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: backgroundColor,
        headerShown: true,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: headerBackgroundColor,
        },
        tabBarHideOnKeyboard: true,
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: headerBackgroundColor,
        },
        headerTitleStyle: {
          color: textColor,
          fontSize: 22,
        },
        headerTintColor: textColor,
        headerBackButtonDisplayMode: "minimal",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "home-variant" : "home-variant-outline"}
              size={24}
              color={colorScheme === "dark" && focused ? "#fff" : color}
            />
          ),
          tabBarLabel: ({ color, focused }) => (
            <Text
              style={{
                color: colorScheme === "dark" && focused ? "#fff" : color,
                fontSize: 12,
                fontWeight: focused ? "bold" : "normal",
              }}
            >
              Home
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="assistant"
        options={{
          title: "Assistant",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "clipboard-list" : "clipboard-list-outline"}
              size={24}
              color={colorScheme === "dark" && focused ? "#fff" : color}
            />
          ),
          tabBarLabel: ({ color, focused }) => (
            <Text
              style={{
                color: colorScheme === "dark" && focused ? "#fff" : color,
                fontSize: 12,
                fontWeight: focused ? "bold" : "normal",
              }}
            >
              Assistant
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "message-reply" : "message-reply-outline"}
              size={24}
              color={colorScheme === "dark" && focused ? "#fff" : color}
            />
          ),
          tabBarLabel: ({ color, focused }) => (
            <Text
              style={{
                color: colorScheme === "dark" && focused ? "#fff" : color,
                fontSize: 12,
                fontWeight: focused ? "bold" : "normal",
              }}
            >
              Chat
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={
                focused
                  ? "file-star-four-points"
                  : "file-star-four-points-outline"
              }
              size={24}
              color={colorScheme === "dark" && focused ? "#fff" : color}
            />
          ),
          tabBarLabel: ({ color, focused }) => (
            <Text
              style={{
                color: colorScheme === "dark" && focused ? "#fff" : color,
                fontSize: 12,
                fontWeight: focused ? "bold" : "normal",
              }}
            >
              History
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "account" : "account-outline"}
              size={24}
              color={colorScheme === "dark" && focused ? "#fff" : color}
            />
          ),
          tabBarLabel: ({ color, focused }) => (
            <Text
              style={{
                color: colorScheme === "dark" && focused ? "#fff" : color,
                fontSize: 12,
                fontWeight: focused ? "bold" : "normal",
              }}
            >
              Profile
            </Text>
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
