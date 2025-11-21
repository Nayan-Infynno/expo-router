import { ThemedText } from "@/src/components/themed-text";
import { ThemedView } from "@/src/components/themed-view";
import { useLocalSearchParams } from "expo-router/build/hooks";
import React from "react";
import { StyleSheet } from "react-native";

const CatchAllProductDetails = () => {
  const { rest } = useLocalSearchParams<{ rest: string[] }>();

  return (
    <ThemedView style={styles.container}>
      <ThemedText>Product Path Original</ThemedText>
      <ThemedText>{rest}</ThemedText>
      <ThemedText style={{ marginTop: 20 }}>
        Product Path (Join by "/")
      </ThemedText>
      <ThemedText>{rest.join("/")}</ThemedText>
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

export default CatchAllProductDetails;
