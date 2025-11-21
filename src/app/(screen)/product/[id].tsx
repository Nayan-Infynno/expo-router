import { ThemedText } from "@/src/components/themed-text";
import { ThemedView } from "@/src/components/themed-view";
import { useLocalSearchParams } from "expo-router/build/hooks";
import React from "react";
import { StyleSheet } from "react-native";

const ProductDetails = () => {
  const { id } = useLocalSearchParams();

  return (
    <ThemedView style={styles.container}>
      <ThemedText>Product Details {id}</ThemedText>
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

export default ProductDetails;
