import React from "react";
import { StyleSheet } from "react-native";

import { ThemedText } from "@/src/components/themed-text";
import { ThemedView } from "@/src/components/themed-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, router } from "expo-router";

const List = () => {
  const goToHomeHandler = async () => {
    try {
      await AsyncStorage.setItem("isSignedIn", "true");
      router.replace("/(tabs)");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ThemedView style={[styles.container]}>
      <ThemedText>List Screen</ThemedText>
      <Link href={"/list/12"}>
        <ThemedText>List Details 1</ThemedText>
      </Link>
      <Link href={"/list/13"}>
        <ThemedText>List Details 2</ThemedText>
      </Link>
      <Link href={"/list/14"}>
        <ThemedText>List Details 3</ThemedText>
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

export default List;
