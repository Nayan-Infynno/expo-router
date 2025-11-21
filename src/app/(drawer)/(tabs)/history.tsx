import { ThemedText } from "@/src/components/themed-text";
import { ThemedView } from "@/src/components/themed-view";
import React from "react";
import { StyleSheet } from "react-native";

const History = () => {
  return (
    <ThemedView style={styles.container}>
      <ThemedText>History Screen</ThemedText>
      <>
        <ThemedText></ThemedText>
      </>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default History;
