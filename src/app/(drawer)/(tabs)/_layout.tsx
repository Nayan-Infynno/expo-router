import React from "react";
import { Text, useColorScheme } from "react-native";

import { HapticTab } from "@/src/components/haptic-tab";
import { useThemeColor } from "@/src/hooks/use-theme-color";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { Tabs } from "expo-router";

const TabLayout = () => {
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({}, "dropDownColor");
  const headerBackgroundColor = useThemeColor({}, "backgroundColor");
  const textColor = useThemeColor({}, "textColor");

  return (
    <Tabs
      screenOptions={({ route }) => ({
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
        tabBarIcon: ({ focused, color }) => {
          let iconName;

          if (route.name === "index")
            iconName = focused ? "home-variant" : "home-variant-outline";
          else if (route.name === "assistant")
            iconName = focused ? "clipboard-list" : "clipboard-list-outline";
          else if (route.name === "chat")
            iconName = focused ? "message-reply" : "message-reply-outline";
          else if (route.name === "history")
            iconName = focused
              ? "file-star-four-points"
              : "file-star-four-points-outline";
          else if (route.name === "profile")
            iconName = focused ? "account" : "account-outline";

          return (
            <MaterialCommunityIcons name={iconName} size={24} color={color} />
          );
        },
        tabBarLabel: ({ color, focused }) => (
          <Text
            style={{
              color: colorScheme === "dark" && focused ? "#fff" : color,
              fontSize: 12,
              fontWeight: focused ? "bold" : "normal",
            }}
          >
            {route.name === "index"
              ? "Home"
              : route.name.split("")[0].toUpperCase() + route.name.slice(1)}
          </Text>
        ),
        headerLeft: () => (
          <DrawerToggleButton
            tintColor={colorScheme === "dark" ? "#fff" : textColor}
            pressOpacity={0.8}
          />
        ),
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="assistant"
        options={{
          title: "Assistant",
        }}
      />
      <Tabs.Screen
        name="chat"
        options={({ route }: any) => {
          return {
            title: "Chat",
            tabBarBadge: route?.params?.tabBarBadge ?? undefined,
          };
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
