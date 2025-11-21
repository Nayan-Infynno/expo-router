import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { themedContainerProps } from "../types";

export const ThemedContainer = ({
  containerStyles,
  children,
  avoidKeyboard,
  isLoading = false,
  isLoadingOverlay = false,
  showHeader = false,
  headerTitle,
  onPressBack,
  showBack = true,
  customHeaderStyles,
  titleStyles,
  rightChildren,
  leftChildren,
  customTitleContainerStyle,
  behavior = undefined,
  AndroidVerticalOffSet = 0,
  iOSVerticalOffSet = 0,
  isChangeStatusBar = true,
}: themedContainerProps) => {
  const insets = useSafeAreaInsets();
  return avoidKeyboard ? (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : behavior}
      keyboardVerticalOffset={
        Platform.OS === "ios" ? iOSVerticalOffSet : AndroidVerticalOffSet
      }
      style={[
        styles.container,
        { paddingTop: insets.top },
        { paddingBottom: insets.bottom },
        containerStyles,
      ]}
    >
      {isChangeStatusBar && (
        <View style={[styles.statusBarContainer, { height: insets.top }]} />
      )}
      {showHeader && (
        // <Header
        //     Title={headerTitle || ""}
        //     showBack={showBack}
        //     onPressLeft={() => {
        //         onPressBack && onPressBack();
        //     }}
        //     customStyles={customHeaderStyles}
        //     rightChildren={rightChildren}
        //     leftChildren={leftChildren}
        //     customTitleContainerStyle={customTitleContainerStyle}
        //     titleStyles={titleStyles}
        // />
        <></>
      )}
      {isLoading ? <ActivityIndicator size="small" color="black" /> : children}
    </KeyboardAvoidingView>
  ) : (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top },
        { paddingBottom: insets.bottom },
        containerStyles,
      ]}
    >
      {isChangeStatusBar && (
        <View style={[styles.statusBarContainer, { height: insets.top }]} />
      )}
      {showHeader && (
        // <Header
        //     Title={headerTitle || ""}
        //     showBack={showBack}
        //     rightChildren={rightChildren}
        //     leftChildren={leftChildren}
        //     onPressLeft={() => {
        //         onPressBack && onPressBack();
        //     }}
        //     customStyles={customHeaderStyles}
        //     customTitleContainerStyle={customTitleContainerStyle}
        //     titleStyles={titleStyles}
        // />
        <></>
      )}
      {isLoading ? <ActivityIndicator size="small" color="black" /> : children}
      {isLoadingOverlay && (
        <View
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: "#ffffff99" },
            styles.justifyCenter,
          ]}
        >
          <ActivityIndicator size="large" color="black" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBarContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderColor: "red",
  },
  justifyCenter: {
    flex: 1,
    justifyContent: "center",
  },
});
