import type { ReactNode } from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ParallaxScrollView from "./parallax-scroll-view";
import { ThemedHeader } from "./Themed-header";
import { ThemedView } from "./themed-view";

interface ThemedContainerProps {
  children: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  isShowHeader?: boolean;
  headerMode?: "center-aligned" | "small" | "medium" | "large";
  headerTitle?: string;
  isShowBack?: boolean;
  onPressBack?: () => void;
}

export const ThemedContainer = ({
  children,
  containerStyle,
  isShowHeader = false,
  headerMode = "center-aligned",
  headerTitle,
  isShowBack = false,
  onPressBack,
}: ThemedContainerProps) => {
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={[styles.container, containerStyle]}>
      {isShowHeader && (
        <ThemedHeader
          title={headerTitle}
          showBack={isShowBack}
          onPressBack={onPressBack}
          mode={headerMode}
        />
      )}
      <ParallaxScrollView style={{ paddingTop: isShowHeader ? 0 : insets.top }}>
        {children}
      </ParallaxScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
