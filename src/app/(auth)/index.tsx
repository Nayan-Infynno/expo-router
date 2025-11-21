import React, { useEffect } from "react";
import { StyleSheet } from "react-native";

import { ThemedText } from "@/src/components/themed-text";
import { ThemedView } from "@/src/components/themed-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";

const Splash = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    getSignedInStatus();
  }, []);

  const getSignedInStatus = async () => {
    try {
      setIsLoading(true);
      const isSignedIn = await AsyncStorage.getItem("isSignedIn");
      if (isSignedIn === "true") {
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      {isLoading ? (
        <ThemedText>Loading...</ThemedText>
      ) : (
        <>
          <ThemedText>Splash/Intro Screen</ThemedText>
          <Link href={"/signin"}>
            <ThemedText>Go to Sign In Screen</ThemedText>
          </Link>
        </>
      )}
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

export default Splash;
