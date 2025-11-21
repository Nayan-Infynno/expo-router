import { StyleSheet } from "react-native";

import { ThemedView } from "@/src/components/themed-view";
import Animated from "react-native-reanimated";
import { parallaxScrollViewProps } from "../types";

export default function ParallaxScrollView({
  style,
  children,
}: parallaxScrollViewProps) {
  return (
    <Animated.ScrollView style={[styles.container, style]}>
      <ThemedView style={styles.innerContent}>{children}</ThemedView>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContent: {
    flex: 1,
    gap: 16,
    paddingHorizontal: 16,
    overflow: "hidden",
  },
});
