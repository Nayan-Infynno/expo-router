import { ThemedText } from "@/src/components/themed-text";
import { ThemedView } from "@/src/components/themed-view";
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";

const Chat = () => {
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      updateTabBarBadge(undefined);
    });

    return unsubscribe;
  }, [navigation]);

  const updateTabBarBadge = (num: number | undefined) => {
    // Method 1
    router.setParams({
      tabBarBadge: num,
    });

    // Method 2
    // navigation.setOptions({
    //   tabBarBadge: num,
    // });
  };

  useEffect(() => {
    setTimeout(() => {
      updateTabBarBadge(3);
    }, 5000);
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ThemedText>Chat Screen</ThemedText>
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

export default Chat;
