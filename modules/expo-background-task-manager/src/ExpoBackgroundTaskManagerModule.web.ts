import { registerWebModule, NativeModule } from 'expo';

import { ChangeEventPayload } from './ExpoBackgroundTaskManager.types';

type ExpoBackgroundTaskManagerModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
}

class ExpoBackgroundTaskManagerModule extends NativeModule<ExpoBackgroundTaskManagerModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
};

export default registerWebModule(ExpoBackgroundTaskManagerModule, 'ExpoBackgroundTaskManagerModule');
