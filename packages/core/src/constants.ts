export const USER_TYPES = ["HUMAN", "AI"] as const;

export const PLOT_POINT_TYPES = [
  "HUMAN_USER_MESSAGE",
  "AI_USER_MESSAGE",
  "ENVIRONMENT_ENTERED",
  "ENVIRONMENT_LEFT",
  "EVALUATION",
  "AUTH_EMAIL_SENT",
] as const;

export const EVALUATABLE_PLOT_POINT_TYPES = [
  "HUMAN_USER_MESSAGE",
  "AI_USER_MESSAGE",
  "EVALUATION",
  "AUTH_EMAIL_SENT",
] as const;

export const AI_USER_CODES = ["NIKO"] as const;

export const TOOL_CODES = [
  "NOOP",
  "RESPOND_GENERAL",
  "SEND_AUTH_EMAIL",
  "REQUEST_EMAIL_ADDRESS",
  "PROCESS_AUTH_TOKEN",
  "CONFIRM_AUTH_EMAIL_SENT",
] as const;

export const MESSAGE_TYPES = ["HUMAN_USER", "AI_USER"] as const;

export const ENVIRONMENT_TYPE_CODES = [
  "WORLD_ROOM",
  "COMPANION_ONE_TO_ONE",
] as const;

export const WORLD_ROOM_CODES = ["UNIVERSE"] as const;

export const THEMES = ["frappe", "latte"] as const;
