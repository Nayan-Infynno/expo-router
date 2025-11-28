import { EventEmitter, NativeModule, requireNativeModule } from "expo";
import { ReactNativeBackgroundRunnerModuleEvents } from "./ReactNativeBackgroundRunner.types";

declare class ReactNativeBackgroundRunnerModuleType extends NativeModule<ReactNativeBackgroundRunnerModuleEvents> {
  startNative(options: any): Promise<void>;
  updateNotification(options: any): Promise<void>;
  stop(): Promise<void>;
  isRunning(): boolean;
  scheduleDaily(hour: number, minute: number, options: any): Promise<void>;
}

const nativeModule = requireNativeModule<ReactNativeBackgroundRunnerModuleType>(
  "ReactNativeBackgroundRunner"
);

// ---- INTERNAL JS STATE (Expo-safe) ----
let activeCallback: null | ((params: any) => Promise<void>) = null;

// event emitter
const emitter = new EventEmitter(nativeModule);

// native → JS
emitter.addListener("onExecute", async (payload: any) => {
  if (typeof activeCallback === "function") {
    await activeCallback(payload);
  }
});

// ---- PUBLIC API (EXACTLY AS YOU WANT) ----
export default {
  // JS function + native options
  async start(callback: any, options: any) {
    activeCallback = callback;
    return nativeModule.startNative(options);
  },

  async updateNotification(options: any) {
    return nativeModule.updateNotification(options);
  },

  async stop() {
    activeCallback = null;
    return nativeModule.stop();
  },

  isRunning() {
    return nativeModule.isRunning();
  },

  async scheduleDaily(hour: number, minute: number, options: any) {
    return nativeModule.scheduleDaily(hour, minute, options);
  },
};
