import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import { ThemedText } from "@/src/components/themed-text";
import { ThemedView } from "@/src/components/themed-view";
import { Link } from "expo-router";

const Home = () => {
  return (
    <ThemedView style={styles.container}>
      <Link href="/(screen)/list" asChild>
        <TouchableOpacity>
          <ThemedText>List listing & Slot Layout</ThemedText>
        </TouchableOpacity>
      </Link>
      <Link href="/(screen)/product">
        <ThemedText>Product listing (id & catch all)</ThemedText>
      </Link>
      <Link href="/profile/john">
        <ThemedText>John Profile (Custom Not found)</ThemedText>
      </Link>
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

export default Home;
