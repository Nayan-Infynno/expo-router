import React from "react";
import { Pressable, StyleSheet } from "react-native";

import { ThemedText } from "@/src/components/themed-text";
import { ThemedView } from "@/src/components/themed-view";
import { HelloWidget } from "@/src/widget/index.android";
import { Link, useRouter } from "expo-router";
import { WidgetPreview } from "react-native-android-widget";

const Home = () => {
  const navigation = useRouter();
  return (
    <ThemedView style={styles.container}>
      <Link href="/(screen)/list">
        <ThemedText>List listing & Slot Layout</ThemedText>
      </Link>
      <Link href="/(screen)/product">
        <ThemedText>Product listing (id & catch all)</ThemedText>
      </Link>
      <Pressable
        onPress={() => navigation.navigate("/(drawer)/(tabs)/profile")}
      >
        <ThemedText>John Profile (Custom Not found)</ThemedText>
      </Pressable>

      <WidgetPreview
        renderWidget={() => <HelloWidget />}
        width={320}
        height={200}
      />
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
