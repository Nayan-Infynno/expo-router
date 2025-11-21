import { ThemedText } from "@/src/components/themed-text";
import { ThemedView } from "@/src/components/themed-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";

const Profile = () => {
  const router = useRouter();

  const onLogoutHandler = async () => {
    try {
      await AsyncStorage.removeItem("isSignedIn");
      router.replace("/(auth)/signin");
    } catch (error) {
      console.log("Error logging out", error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText>Profile</ThemedText>
      <Button onPress={onLogoutHandler}>
        <ThemedText>Logout</ThemedText>
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

export default Profile;
