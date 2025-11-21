import React from "react";
import { StyleSheet } from "react-native";

import { ThemedText } from "@/src/components/themed-text";
import { ThemedView } from "@/src/components/themed-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, router } from "expo-router";
import { Button } from "react-native-paper";

const SignIn = () => {
  const goToHomeHandler = async () => {
    try {
      await AsyncStorage.setItem("isSignedIn", "true");
      // router.replace("/(tabs)");
      router.replace("/(drawer)");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText>Sign In</ThemedText>
      <Link href={"/signup"}>
        <ThemedText>Go to Sign Up Screen</ThemedText>
      </Link>

      <Button onPress={goToHomeHandler}>
        <ThemedText>Go to Home Screen</ThemedText>
      </Button>
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

export default SignIn;
