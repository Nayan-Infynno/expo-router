import { ConfigContext } from "expo/config";

const IS_DEV = process.env.APP_VARIANT === "developmentBuild";
const IS_STAGING = process.env.APP_VARIANT === "stagingBuild";

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return "com.expopilot.dev";
  }
  if (IS_STAGING) {
    return "com.expopilot.staging";
  }
  return "com.expopilot";
};

const getAppName = () => {
  if (IS_DEV) {
    return "ExpoPilot (Dev)";
  }
  if (IS_STAGING) {
    return "ExpoPilot (Staging)";
  }
  return "ExpoPilot";
};

export default ({ config }: ConfigContext) => ({
  ...config,
  expo: {
    name: getAppName(),
    slug: "ExpoPilot",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "expopilot",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: getUniqueIdentifier(),
      infoPlist: {
        UIViewControllerBasedStatusBarAppearance: true,
        UIDesignRequiresCompatibility: true,
      },
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: getUniqueIdentifier(),
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000",
          },
        },
      ],
      [
        "expo-router",
        {
          root: "./src/app",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: "5377f7c7-0a06-4040-9199-b13423b31835",
      },
    },
  },
});
