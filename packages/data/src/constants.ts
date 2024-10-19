export const USER_TYPES = ["ANONYMOUS", "AUTHENTICATED", "AI"] as const;

export const PLOT_POINT_TYPES = [
  "AUTHENTICATED_USER_MESSAGE",
  "AI_USER_MESSAGE",
  "ENVIRONMENT_ENTERED",
  "ENVIRONMENT_LEFT",
] as const;

export const AI_USER_CODES = ["G", "IVAN", "THE_HOSTESS"] as const;

export const MESSAGE_TYPES = ["AUTHENTICATED_USER", "AI_USER"] as const;

export const ENVIRONMENT_TYPE_CODES = [
  "WORLD_ROOM",
  "COMPANION_ONE_TO_ONE",
] as const;

export const WORLD_ROOM_CODES = ["UNIVERSE"] as const;

export const ICON_CODES = ["STARS", "LOCK"] as const;
