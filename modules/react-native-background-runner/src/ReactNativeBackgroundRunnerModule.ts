import { NativeModule, requireNativeModule } from "expo";
import {
  ExecuteEventPayload,
  ReactNativeBackgroundRunnerModuleEvents,
} from "./ReactNativeBackgroundRunner.types";

declare class ReactNativeBackgroundRunnerModuleType extends NativeModule<ReactNativeBackgroundRunnerModuleEvents> {
  startNative(options: any): Promise<void>;
  updateNotification(options: any): Promise<void>;
  stop(): Promise<void>;
  isRunning(): boolean;
  scheduleDaily(hour: number, minute: number, options: any): Promise<void>;

  addListener<EventName extends keyof ReactNativeBackgroundRunnerModuleEvents>(
    eventName: EventName,
    listener: ReactNativeBackgroundRunnerModuleEvents[EventName]
  ): import("expo-modules-core").EventSubscription;
  removeListeners(count: number): void;
}

const nativeModule = requireNativeModule<ReactNativeBackgroundRunnerModuleType>(
  "ReactNativeBackgroundRunner"
);

// INTERNAL STATE
let activeCallback: null | ((params: any) => Promise<void>) = null;
let defaultHandler: null | ((params: any) => Promise<void>) = null;

nativeModule.addListener("onExecute", async (payload: ExecuteEventPayload) => {
  try {
    if (activeCallback) {
      await activeCallback(payload);
      return;
    }
    if (defaultHandler) {
      await defaultHandler(payload);
      return;
    }
    console.warn(
      "BackgroundRunner: onExecute fired but no JS handler registered",
      payload
    );
  } catch (err) {
    console.error("❌ BackgroundRunner handler crashed:", err);
  }
});

// ---- PUBLIC API ----
export default {
  /**
   * Start background service and register callback.
   */
  async start(callback: any, options: any) {
    activeCallback = callback;
    return nativeModule.startNative(options);
  },

  /**
   * Stop service
   */
  async stop() {
    activeCallback = null;
    return nativeModule.stop();
  },

  async updateNotification(options: any) {
    return nativeModule.updateNotification(options);
  },

  isRunning() {
    return nativeModule.isRunning();
  },

  async scheduleDaily(hour: number, minute: number, options: any) {
    console.log("Will runt he scheduled task");
    return nativeModule.scheduleDaily(hour, minute, options);
  },

  /**
   * Optional fallback headless handler
   */
  registerDefault(handler: any) {
    defaultHandler = handler;
  },
};
