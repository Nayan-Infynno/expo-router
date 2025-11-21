import { ThemedText } from "@/src/components/themed-text";
import { ThemedView } from "@/src/components/themed-view";
import { Slot } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SlotLayout = () => {
  const insets = useSafeAreaInsets();
  return (
    <ThemedView style={[styles.container, { paddingBottom: insets.bottom }]}>
      <ThemedView style={styles.headerContainer}>
        <ThemedText>Header</ThemedText>
      </ThemedView>
      <Slot />
      <ThemedView style={styles.footerContainer}>
        <ThemedText>Footer</ThemedText>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    height: 50,
    backgroundColor: "green",
  },
  footerContainer: {
    height: 50,
    backgroundColor: "blue",
  },
});

export default SlotLayout;
