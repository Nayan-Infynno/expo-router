import React from "react";
import { StyleSheet } from "react-native";
import { Appbar } from "react-native-paper";
import { useThemeColor } from "../hooks/use-theme-color";
import { ThemedHeaderProps } from "../types";

export const ThemedHeader = ({
  title = "",
  showBack = false,
  onPressBack,
  leftActions = [],
  rightActions = [],
  mode = "center-aligned",
  containerStyle,
  titleStyle,
}: ThemedHeaderProps) => {
  const backgroundColor = useThemeColor({}, "secondaryColor");
  const textColor = useThemeColor({}, "wrapperColor");

  return (
    <Appbar.Header
      mode={mode}
      style={[
        {
          backgroundColor: backgroundColor,
          borderBottomColor: "red",
        },
        containerStyle,
      ]}
    >
      {showBack && (
        <Appbar.BackAction onPress={onPressBack} color={textColor} />
      )}
      {leftActions.map((action, index) => (
        <Appbar.Action
          key={`left-${index}`}
          icon={action.icon}
          onPress={action.onPress}
          color={textColor}
          disabled={action.disabled}
        />
      ))}
      <Appbar.Content
        title={title}
        titleStyle={[{ color: textColor }, titleStyle]}
      />
      {rightActions.map((action, index) => (
        <Appbar.Action
          key={`right-${index}`}
          icon={action.icon}
          onPress={action.onPress}
          color={textColor}
        />
      ))}
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
