import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoBackgroundTaskManagerViewProps } from './ExpoBackgroundTaskManager.types';

const NativeView: React.ComponentType<ExpoBackgroundTaskManagerViewProps> =
  requireNativeView('ExpoBackgroundTaskManager');

export default function ExpoBackgroundTaskManagerView(props: ExpoBackgroundTaskManagerViewProps) {
  return <NativeView {...props} />;
}
