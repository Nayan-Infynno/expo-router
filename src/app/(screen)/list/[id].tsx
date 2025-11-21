import { ThemedText } from "@/src/components/themed-text";
import { ThemedView } from "@/src/components/themed-view";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

const ListDetails = () => {
  const { id } = useLocalSearchParams();

  return (
    <ThemedView style={styles.container}>
      <ThemedText>ListDetails {id}</ThemedText>
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

export default ListDetails;
