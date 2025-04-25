
// Device models
export interface Device {
  id: string;
  name: string;
  ipAddress: string;
  lastSyncTime: Date | null;
  syncStatus: SyncStatus;
  model: string;
  version: string;
}

export enum SyncStatus {
  InSync = "IN_SYNC",
  OutOfSync = "OUT_OF_SYNC",
  Warning = "WARNING",
  Unknown = "UNKNOWN"
}

// Configuration models
export interface Configuration {
  id: string;
  deviceId: string;
  deviceName: string;
  timestamp: Date;
  content: string;
}

export interface ConfigSelectionState {
  leftDevice: string | null;
  leftTimestamp: Date | null;
  rightDevice: string | null;
  rightTimestamp: Date | null;
}

// Diff result models
export interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  content: string;
  lineNumber: {
    left: number | null;
    right: number | null;
  };
}

export interface DiffResult {
  lines: DiffLine[];
}
