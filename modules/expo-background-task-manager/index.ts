// Reexport the native module. On web, it will be resolved to ExpoBackgroundTaskManagerModule.web.ts
// and on native platforms to ExpoBackgroundTaskManagerModule.ts
export { default } from './src/ExpoBackgroundTaskManagerModule';
export { default as ExpoBackgroundTaskManagerView } from './src/ExpoBackgroundTaskManagerView';
export * from  './src/ExpoBackgroundTaskManager.types';
