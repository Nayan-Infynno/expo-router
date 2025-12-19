import { ThemedText } from "@/src/components/themed-text";
import { ThemedView } from "@/src/components/themed-view";
import { router } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";

const Assistant = () => {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Animation Components</ThemedText>
      <ThemedView style={{ gap: 10 }}>
        <Button mode="outlined" onPress={() => router.navigate("/animation")}>
          Animation List Indicator
        </Button>
        <Button
          mode="outlined"
          onPress={() => router.navigate("/animation/animatedBar")}
        >
          Animated Bars
        </Button>
        <Button
          mode="outlined"
          onPress={() => router.navigate("/animation/scrollViewDemo")}
        >
          Scroll View Demo
        </Button>
        <Button
          mode="outlined"
          onPress={() => router.navigate("/animation/Menu")}
        >
          Menu
        </Button>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default Assistant;
