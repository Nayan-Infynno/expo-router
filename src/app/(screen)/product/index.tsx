import { ThemedText } from "@/src/components/themed-text";
import { ThemedView } from "@/src/components/themed-view";
import { Link } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

const index = () => (
  <ThemedView style={styles.container}>
    <ThemedText>Product Listing</ThemedText>

    <Link href="/product/1">
      <ThemedText>Product 1</ThemedText>
    </Link>
    <Link href="/product/2">
      <ThemedText>Product 2</ThemedText>
    </Link>
    <Link href="/product/3">
      <ThemedText>Product 3</ThemedText>
    </Link>

    <Link href="/product/best-seller/playstation-5">
      <ThemedText>Product Catch all segments 1 (best seller)</ThemedText>
    </Link>
    <Link href="/product/deals/black-friday/handicraft/toran/90">
      <ThemedText>Product Catch all segments 2 (deals)</ThemedText>
    </Link>
    <Link href="/product/search=realme-gt-neo-2/black">
      <ThemedText>Product Catch all segments 3 (search)</ThemedText>
    </Link>
  </ThemedView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default index;
