// Reexport the native module. On web, it will be resolved to ExpoBackgroundTaskManagerModule.web.ts
// and on native platforms to ExpoBackgroundTaskManagerModule.ts
export * from "./src/ExpoBackgroundTaskManager.types";
export { default } from "./src/ExpoBackgroundTaskManagerModule";
