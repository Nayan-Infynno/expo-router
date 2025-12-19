import React, { useRef, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const dummyData = Array.from({ length: 20 }).map((_, i) => ({
  id: i + 1,
  title: `Item ${i + 1}`,
  desc: "Ye ek dummy description hai",
}));

import { useSafeAreaInsets } from "react-native-safe-area-context";

const scrollViewDemo = () => {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef(null);
  const [refreshing, setRefreshing] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  return (
    <ScrollView
      ref={scrollRef}
      /* ===== BASIC ===== */
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: insets.bottom,
      }}
      /* ===== SCROLL BEHAVIOR ===== */
      scrollEnabled={true}
      pagingEnabled={false}
      decelerationRate="normal"
      bounces={true}
      /* ===== INDICATOR ===== */
      showsVerticalScrollIndicator={true}
      /* ===== KEYBOARD ===== */
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      /* ===== EVENTS ===== */
      onScroll={(e) => {
        setScrollY(e.nativeEvent.contentOffset.y);
      }}
      scrollEventThrottle={16}
      /* ===== PULL TO REFRESH ===== */
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      /* ===== STICKY HEADER ===== */
      stickyHeaderIndices={[0]}
    >
      {/* 🔹 Sticky Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={styles.headerText}>Sticky Header</Text>
      </View>

      {/* 🔹 Input (Keyboard test) */}
      <View style={{ backgroundColor: "#Fff" }}>
        <View style={[styles.inputBox, { marginVertical: insets.top }]}>
          <TextInput placeholder="Type something..." />
        </View>
      </View>

      {/* 🔹 Dummy List */}
      {dummyData.map((item) => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.desc}>{item.desc}</Text>
        </View>
      ))}

      {/* 🔹 Footer */}
      <View style={styles.footer}>
        <Text>Scroll Y Offset: {Math.floor(scrollY)}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6FA",
  },
  header: {
    backgroundColor: "#4F46E5",
    padding: 16,
  },
  headerText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },
  inputBox: {
    backgroundColor: "#FFF",
  },
  card: {
    backgroundColor: "#FFF",
    padding: 16,
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  desc: {
    marginTop: 4,
    color: "#555",
  },
  footer: {
    alignItems: "center",
    marginTop: 20,
  },
});

export default scrollViewDemo;
