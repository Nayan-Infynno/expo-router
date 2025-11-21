import React from "react";
import { StyleSheet } from "react-native";

import { ThemedText } from "@/src/components/themed-text";
import { ThemedView } from "@/src/components/themed-view";
import { useRouter } from "expo-router";
import { Button } from "react-native-paper";

const SignUp = () => {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <ThemedText>Sign Up</ThemedText>
      <Button onPress={() => router.back()}>
        <ThemedText>Go to Sign In Screen</ThemedText>
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

export default SignUp;
