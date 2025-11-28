// No need for View types now because this module has no UI view

// ----------------------------
// EVENT PAYLOAD TYPES
// ----------------------------

// Native → JS event payload
export type ExecuteEventPayload = {
  parameters: any;
};

// All event types emitted by native module
export type ReactNativeBackgroundRunnerModuleEvents = {
  onExecute: (payload: ExecuteEventPayload) => void;
};

// ----------------------------
// OPTIONS PASSED TO start()
// ----------------------------
export type BackgroundRunnerTaskIcon = {
  name: string;
  type: string; // mipmap / drawable
};

export type BackgroundRunnerOptions = {
  taskName?: string;
  taskTitle?: string;
  taskDesc?: string;
  taskIcon?: BackgroundRunnerTaskIcon;
  color?: string;
  linkingURI?: string;
  parameters?: any; // user dynamic params
};

// ----------------------------
// If you ever need view props in future
// (you currently DO NOT use them)
// ----------------------------
export type ReactNativeBackgroundRunnerViewProps = {
  // For future expansion if UI added
  style?: any;
};
