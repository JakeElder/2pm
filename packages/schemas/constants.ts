const CHANNEL_CODES = ["UNIVERSE", "HALL_OF_PRIVACY"] as const;

export type ChannelCode = (typeof CHANNEL_CODES)[number];
