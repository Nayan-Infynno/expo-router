import * as React from 'react';

import { ExpoBackgroundTaskManagerViewProps } from './ExpoBackgroundTaskManager.types';

export default function ExpoBackgroundTaskManagerView(props: ExpoBackgroundTaskManagerViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
