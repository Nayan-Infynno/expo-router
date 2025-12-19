import { generateAlphabeticalContacts } from "@/assets/data/dummyData";
import { useHeaderHeight } from "@react-navigation/elements";
import { useTheme } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  LinearTransition,
  scrollTo,
  SharedValue,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useScrollViewOffset,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { runOnJS } from "react-native-worklets";

const contacts = generateAlphabeticalContacts(1000);
const sortedContacts = contacts.sort((a, b) => a.name.localeCompare(b.name));
const total = contacts.length;
const size = 80;
const indicatorSize = 45;
const indicatorWidth = 15;

const index = () => {
  const { bottom } = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const [activeBlock, setActiveBlock] = useState(0);
  const theme = useTheme();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const contentHeight = total * size;
  const { height } = useWindowDimensions();
  const isActive: SharedValue<boolean> = useSharedValue(false);
  const isDragActive: SharedValue<boolean> = useSharedValue(false);
  const initialVal: SharedValue<number> = useSharedValue(10);
  const indicatorOffset: SharedValue<number> = useSharedValue(10);
  const deviceHeight = height - bottom - headerHeight - indicatorSize;

  const numbersAlphabetically = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];

  useDerivedValue(() => {
    if (isDragActive.value) {
      const newIndex = Math.floor(scrollOffset.value / (contentHeight / 26));
      runOnJS(setActiveBlock)(newIndex);
    }
  });

  const animatedScrubberBg = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(
        isActive.value ? theme.colors.primary : theme.colors.border,
        { duration: 200 }
      ),
    };
  });

  const animatedScrubber = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isDragActive.value ? 1 : 0, { duration: 200 }),
      transform: [{ translateX: withTiming(isDragActive.value ? 0 : 20) }],
    };
  });

  const animatedScrubberContainer = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: isDragActive.value
            ? indicatorOffset.value
            : interpolate(
                scrollOffset.value,
                [0, contentHeight],
                [10, deviceHeight],
                Extrapolation.CLAMP
              ),
        },
      ],
    };
  });

  const pan = Gesture.Pan()
    .onStart((e) => {
      initialVal.value = interpolate(
        scrollOffset.value,
        [0, contentHeight],
        [10, deviceHeight],
        Extrapolation.CLAMP
      );
      isDragActive.value = true;
    })
    .onChange((e) => {
      const val = initialVal.value + e.translationY;
      const clampVal = Math.min(deviceHeight, Math.max(0, val));
      indicatorOffset.value = clampVal;
      scrollTo(
        scrollRef,
        0,
        interpolate(
          clampVal,
          [10, deviceHeight],
          [0, contentHeight],
          Extrapolation.CLAMP
        ),
        false
      );
    })
    .onEnd(() => {
      initialVal.value = indicatorOffset.value;
      isDragActive.value = false;
      isActive.value = false;
    });

  return (
    <GestureHandlerRootView style={styles.flexOne}>
      <View style={styles.flexOne}>
        <Animated.ScrollView
          ref={scrollRef}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          {sortedContacts.map((item) => (
            <View key={item.id.toString()} style={styles.countWrapper}>
              <View
                style={{
                  backgroundColor: "#fff",
                  padding: 8,
                  borderRadius: 8,
                }}
              >
                <Text style={[styles.countText, { color: theme.colors.text }]}>
                  {item.name}
                </Text>
                <Text style={[styles.countText, { color: theme.colors.text }]}>
                  {item.number}
                </Text>
              </View>
            </View>
          ))}
        </Animated.ScrollView>
        <GestureDetector gesture={pan}>
          <Animated.View
            onTouchStart={() => (isActive.value = true)}
            onTouchEnd={() => (isActive.value = false)}
            style={[animatedScrubberContainer, styles.scrubContainer]}
          >
            <Animated.View
              layout={LinearTransition.duration(200)}
              style={[
                animatedScrubberBg,
                animatedScrubber,
                styles.scrubLabelWrapper,
              ]}
            >
              <Text style={styles.scrubLabel}>
                {numbersAlphabetically[activeBlock]}
              </Text>
            </Animated.View>
            <Animated.View style={[styles.scrubStyle, animatedScrubberBg]} />
          </Animated.View>
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );
};

export default index;

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  countWrapper: {
    height: size,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  countText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  scrubContainer: {
    width: 200,
    height: indicatorSize,
    position: "absolute",
    right: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 20,
  },
  scrubLabelWrapper: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 100,
    overflow: "hidden",
  },
  scrubLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "white",
    textAlign: "center",
  },
  scrubStyle: {
    width: indicatorWidth,
    height: indicatorSize,
    borderRadius: indicatorWidth / 2,
  },
});
