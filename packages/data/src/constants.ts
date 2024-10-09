export const USER_TYPES = ["ANONYMOUS", "HUMAN", "AI"] as const;

export const PLOT_POINT_TYPES = [
  "HUMAN_MESSAGE",
  "AI_MESSAGE",
  "ENVIRONMENT_ENTERED",
  "ENVIRONMENT_LEFT",
] as const;

export const AI_USER_CODES = ["G", "IVAN"] as const;

export const ENVIRONMENT_TYPE_CODES = [
  "WORLD_ROOM",
  "COMPANION_ONE_TO_ONE",
] as const;

export const WORLD_ROOM_CODES = ["UNIVERSE"] as const;
