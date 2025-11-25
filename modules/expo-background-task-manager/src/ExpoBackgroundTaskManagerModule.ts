import { NativeModule, requireNativeModule } from 'expo';

import { ExpoBackgroundTaskManagerModuleEvents } from './ExpoBackgroundTaskManager.types';

declare class ExpoBackgroundTaskManagerModule extends NativeModule<ExpoBackgroundTaskManagerModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoBackgroundTaskManagerModule>('ExpoBackgroundTaskManager');
