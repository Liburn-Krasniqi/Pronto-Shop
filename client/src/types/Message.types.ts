export enum MessageType { // This sets the theme of the alert
  SUCCESS = "success",
  ERROR = "danger",
  WARNING = "warning",
  INFO = "info",
}

export interface MessageConfig {
  type: MessageType;
  title?: string; // Make optional
  content: React.ReactNode; // Allow any React content
  show: boolean;
  autoCloseDelay?: number;
}
