import { ThemedText } from "@/src/components/themed-text";
import { ThemedView } from "@/src/components/themed-view";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

const NotFound = () => {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <Image
        source={{
          uri: "https://img.freepik.com/premium-vector/404-error-page-file-found-icon-cute-green-cactus-isolated-ux-ui-vector-illustration-web-mobile-design_126267-5832.jpg",
          cache: "reload",
        }}
        style={styles.imageContainer}
        resizeMode="cover"
      />

      <Button
        mode="outlined"
        style={styles.buttonContainer}
        onPress={() => router.back()}
      >
        <ThemedText>Go Back</ThemedText>
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
  imageContainer: {
    width: "80%",
    height: 200,
    borderRadius: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default NotFound;
