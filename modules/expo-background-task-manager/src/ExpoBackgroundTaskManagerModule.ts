import { NativeModule, requireNativeModule } from "expo";

export interface StartOptions {
  title?: string;
  message?: string;
  interval?: number; // milliseconds
}

export interface UpdateNotificationOptions {
  title?: string;
  message?: string;
}

declare class ExpoBackgroundTaskManagerModule extends NativeModule {
  start(options: StartOptions): Promise<boolean>;
  stop(): Promise<boolean>;
  updateNotification(options: UpdateNotificationOptions): Promise<boolean>;
}

export default requireNativeModule<ExpoBackgroundTaskManagerModule>(
  "ExpoBackgroundTaskManager"
);
