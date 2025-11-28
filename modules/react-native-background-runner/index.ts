// Reexport the native module. On web, it will be resolved to ReactNativeBackgroundRunnerModule.web.ts
// and on native platforms to ReactNativeBackgroundRunnerModule.ts
export * from "./src/ReactNativeBackgroundRunner.types";
export { default } from "./src/ReactNativeBackgroundRunnerModule";
