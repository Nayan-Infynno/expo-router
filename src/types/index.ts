import { ReactNode } from "react";
import { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Appbar } from "react-native-paper";

export interface parallaxScrollViewProps {
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}

export type AppBarActionIcon = React.ComponentProps<
  typeof Appbar.Action
>["icon"];

export interface ThemedHeaderProps {
  title?: string;
  showBack?: boolean;
  onPressBack?: () => void;

  leftActions?: Array<{
    icon: AppBarActionIcon;
    onPress: () => void;
    disabled?: boolean;
  }>;

  rightActions?: Array<{
    icon: AppBarActionIcon;
    onPress: () => void;
    disabled?: boolean;
  }>;

  mode?: "center-aligned" | "small" | "medium" | "large";

  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
}
