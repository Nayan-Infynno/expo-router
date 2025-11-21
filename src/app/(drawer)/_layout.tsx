import { useThemeColor } from "@/src/hooks/use-theme-color";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";
import React from "react";
import { useColorScheme } from "react-native";

const DrawerLayout = () => {
  const colorScheme = useColorScheme();
  const headerBackgroundColor = useThemeColor({}, "backgroundColor");
  const textColor = useThemeColor({}, "textColor");
  const border = useThemeColor({}, "border");
  const lightTextColor = useThemeColor({}, "lightTextColor");
  const secondary = useThemeColor({}, "secondary");
  const shimmerColor1 = useThemeColor({}, "shimmerColor1");

  return (
    <Drawer
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: headerBackgroundColor,
        },
        headerTitleStyle: {
          color: textColor,
          fontSize: 22,
        },
        headerTintColor: textColor,
        headerBackButtonDisplayMode: "minimal",
        drawerType: "front",
        drawerStyle: {
          backgroundColor: border,
          width: "80%",
        },
        drawerActiveTintColor: shimmerColor1,
        drawerInactiveTintColor: textColor,
        drawerActiveBackgroundColor:
          colorScheme === "dark" ? lightTextColor : secondary,
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: "400",
        },
        overlayColor:
          colorScheme === "dark" ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.3)",
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          headerShown: false,
          title: "Home",
          drawerIcon: ({ focused, color }) => (
            <MaterialCommunityIcons
              name={focused ? "home-variant" : "home-variant-outline"}
              size={24}
              color={colorScheme === "dark" && focused ? shimmerColor1 : color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="setting"
        options={{
          title: "Setting",
          drawerIcon: ({ focused, color }) => (
            <MaterialCommunityIcons
              name={focused ? "cog" : "cog-outline"}
              size={24}
              color={colorScheme === "dark" && focused ? shimmerColor1 : color}
            />
          ),
        }}
      />
    </Drawer>
  );
};

export default DrawerLayout;
