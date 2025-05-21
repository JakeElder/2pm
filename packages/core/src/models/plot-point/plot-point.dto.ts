import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";
import { HumanMessageDtoSchema } from "../human-message/human-message.dto";
import { AiMessageDtoSchema } from "../ai-message/ai-message.dto";
import { PLOT_POINT_TYPES } from "./plot-point.constants";
import { UserEnvironmentPresenceStateSchema } from "../user-environment-presence";
import { createSelectSchema } from "drizzle-zod";
import {
  aiMessages,
  environments,
  humanMessages,
  plotPoints,
  themes,
  users,
} from "../../db/app.schema";
import {
  kjvBooks,
  kjvChunks,
  kjvVerses,
  paliCanonChunks,
} from "../../db/library.schema";
import { HumanUserThemeDtoSchema } from "../human-user-theme/human-user-theme.dto";
import { HumanUserDtoSchema } from "../user";

/**
 * Chain User
 */

const ChainAnonymousUserSchema = z.object({
  type: z.literal("ANONYMOUS"),
  id: createSelectSchema(users).shape.id,
  tag: z.string(),
});

const ChainAuthenticatedUserSchema = z.object({
  type: z.literal("AUTHENTICATED"),
  id: createSelectSchema(users).shape.id,
  tag: z.string(),
});

const ChainAiUserSchema = z.object({
  type: z.literal("AI"),
  id: createSelectSchema(users).shape.id,
  tag: z.string(),
});

const ChainHumanUserSchema = z.discriminatedUnion("type", [
  ChainAuthenticatedUserSchema,
  ChainAnonymousUserSchema,
]);

const ChainUserSchema = z.discriminatedUnion("type", [
  ChainAuthenticatedUserSchema,
  ChainAnonymousUserSchema,
  ChainAiUserSchema,
]);

export type ChainHumanUser = z.infer<typeof ChainHumanUserSchema>;
export type ChainAiUser = z.infer<typeof ChainAiUserSchema>;
export type ChainUser = z.infer<typeof ChainUserSchema>;

/**
 * Human Message
 */
export const HumanMessagePlotPointDtoSchema = z.object({
  type: z.literal("HUMAN_MESSAGE"),
  data: HumanMessageDtoSchema,
});

export const HumanMessageChainPlotPointSchema = z.object({
  type: z.literal("HUMAN_MESSAGE"),
  data: z.object({
    user: ChainHumanUserSchema,
    message: createSelectSchema(humanMessages).shape.text,
    date: createSelectSchema(plotPoints).shape.createdAt,
  }),
});

export class HumanMessagePlotPointDto extends createZodDto(
  HumanMessagePlotPointDtoSchema,
) {}

/**
 * Ai Message
 */
export const AiMessagePlotPointDtoSchema = z.object({
  type: z.literal("AI_MESSAGE"),
  data: AiMessageDtoSchema,
});

export const AiMessageChainPlotPointSchema = z.object({
  type: z.literal("AI_MESSAGE"),
  data: z.object({
    user: ChainAiUserSchema,
    message: createSelectSchema(aiMessages).shape.content,
    date: createSelectSchema(plotPoints).shape.createdAt,
  }),
});

export class AiMessagePlotPointDto extends createZodDto(
  AiMessagePlotPointDtoSchema,
) {}

/**
 * Environment Entered
 */
export const EnvironmentEnteredPlotPointDtoSchema = z.object({
  type: z.literal("ENVIRONMENT_ENTERED"),
  data: UserEnvironmentPresenceStateSchema,
});

export class EnvironmentEnteredPlotPointDto extends createZodDto(
  EnvironmentEnteredPlotPointDtoSchema,
) {}

export const EnvironmentEnteredChainPlotPointSchema = z.object({
  type: z.literal("ENVIRONMENT_ENTERED"),
  data: z.object({
    user: ChainUserSchema,
    date: createSelectSchema(plotPoints).shape.createdAt,
  }),
});

/**
 * Environment Left
 */
export const EnvironmentLeftPlotPointDtoSchema = z.object({
  type: z.literal("ENVIRONMENT_LEFT"),
  data: UserEnvironmentPresenceStateSchema,
});

export class EnvironmentLeftPlotPointDto extends createZodDto(
  EnvironmentLeftPlotPointDtoSchema,
) {}

export const EnvironmentLeftChainPlotPointSchema = z.object({
  type: z.literal("ENVIRONMENT_LEFT"),
  data: z.object({
    user: ChainUserSchema,
    date: createSelectSchema(plotPoints).shape.createdAt,
  }),
});

/**
 * Bible Verse Reference
 */
export const PaliCanonReferencePlotPointDtoSchema = z.object({
  type: z.literal("PALI_CANON_REFERENCE"),
  data: z.object({
    plotPoint: createSelectSchema(plotPoints).extend({
      createdAt: z.coerce.date(),
    }),
    environment: createSelectSchema(environments),
    paliCanonChunk: createSelectSchema(paliCanonChunks).omit({
      embedding: true,
    }),
  }),
});

export class PaliCanonReferencePlotPointDto extends createZodDto(
  PaliCanonReferencePlotPointDtoSchema,
) {}

export const PaliCanonReferenceChainPlotPointDtoSchema = z.object({
  type: z.literal("PALI_CANON_REFERENCE"),
  data: z.object({
    basket: z.string(),
    author: z.string(),
    passage: z.string(),
    date: createSelectSchema(plotPoints).shape.createdAt,
  }),
});

/**
 * Bible Verse Reference
 */
export const BibleVerseReferencePlotPointDtoSchema = z.object({
  type: z.literal("BIBLE_VERSE_REFERENCE"),
  data: z.object({
    plotPoint: createSelectSchema(plotPoints).extend({
      createdAt: z.coerce.date(),
    }),
    environment: createSelectSchema(environments),
    bibleVerse: createSelectSchema(kjvVerses),
    bibleBook: createSelectSchema(kjvBooks),
    bibleChunk: createSelectSchema(kjvChunks).omit({ embedding: true }),
  }),
});

export class BibleVerseReferencePlotPointDto extends createZodDto(
  BibleVerseReferencePlotPointDtoSchema,
) {}

export const BibleVerseReferenceChainPlotPointDtoSchema = z.object({
  type: z.literal("BIBLE_VERSE_REFERENCE"),
  data: z.object({
    passage: createSelectSchema(kjvChunks).shape.content,
    verse: createSelectSchema(kjvVerses),
    date: createSelectSchema(plotPoints).shape.createdAt,
  }),
});

/**
 * User Theme Switched
 */
export const UserThemeSwitchedPlotPointDtoSchema = z.object({
  type: z.literal("USER_THEME_SWITCHED"),
  data: z.object({
    plotPoint: createSelectSchema(plotPoints).extend({
      createdAt: z.coerce.date(),
    }),
    environment: createSelectSchema(environments),
    humanUserTheme: HumanUserThemeDtoSchema,
    from: createSelectSchema(themes),
    to: createSelectSchema(themes),
  }),
});

export const UserThemeSwitchedChainPlotPointSchema = z.object({
  type: z.literal("USER_THEME_SWITCHED"),
  data: z.object({
    date: createSelectSchema(plotPoints).shape.createdAt,
    user: ChainUserSchema,
    fromThemeId: createSelectSchema(themes).shape.id,
    toThemeId: createSelectSchema(themes).shape.id,
  }),
});

export class UserThemeSwitchedPlotPointDto extends createZodDto(
  UserThemeSwitchedPlotPointDtoSchema,
) {}

/**
 * Theme Created
 */
export const ThemeCreatedPlotPointDtoSchema = z.object({
  type: z.literal("THEME_CREATED"),
  data: z.object({
    plotPoint: createSelectSchema(plotPoints).extend({
      createdAt: z.coerce.date(),
    }),
    environment: createSelectSchema(environments),
    theme: createSelectSchema(themes),
    humanUser: HumanUserDtoSchema,
  }),
});

export const ThemeCreatedChainPlotPointSchema = z.object({
  type: z.literal("THEME_CREATED"),
  data: z.object({
    date: createSelectSchema(plotPoints).shape.createdAt,
    user: ChainHumanUserSchema,
    theme: createSelectSchema(themes),
  }),
});

export class ThemeCreatedPlotPointDto extends createZodDto(
  ThemeCreatedPlotPointDtoSchema,
) {}

/**
 * Themes Listed
 */
export const ThemesListedPlotPointDtoSchema = z.object({
  type: z.literal("THEMES_LISTED"),
  data: z.object({
    plotPoint: createSelectSchema(plotPoints).extend({
      createdAt: z.coerce.date(),
    }),
    environment: createSelectSchema(environments),
    themes: z.array(createSelectSchema(themes)),
    humanUser: HumanUserDtoSchema,
  }),
});

export const ThemesListedChainPlotPointSchema = z.object({
  type: z.literal("THEMES_LISTED"),
  data: z.object({
    date: createSelectSchema(plotPoints).shape.createdAt,
    user: ChainHumanUserSchema,
    themeIds: z.array(createSelectSchema(themes).shape.id),
  }),
});

export class ThemesListedPlotPointDto extends createZodDto(
  ThemesListedPlotPointDtoSchema,
) {}

/**
 * Theme Updated
 */
export const ThemeUpdatedPlotPointDtoSchema = z.object({
  type: z.literal("THEME_UPDATED"),
  data: z.object({
    plotPoint: createSelectSchema(plotPoints).extend({
      createdAt: z.coerce.date(),
    }),
    environment: createSelectSchema(environments),
    theme: createSelectSchema(themes),
    patch: z.array(z.any()),
    humanUser: HumanUserDtoSchema,
  }),
});

export const ThemeUpdatedChainPlotPointSchema = z.object({
  type: z.literal("THEME_UPDATED"),
  data: z.object({
    date: createSelectSchema(plotPoints).shape.createdAt,
    user: ChainHumanUserSchema,
    theme: createSelectSchema(themes),
    patch: z.array(z.any()),
  }),
});

export class ThemeUpdatedPlotPointDto extends createZodDto(
  ThemeUpdatedPlotPointDtoSchema,
) {}

/**
 * Human Post
 */

export const HumanPostPlotPointDtoSchema = z.object({
  type: z.literal("HUMAN_POST"),
  data: z.object({
    plotPoint: createSelectSchema(plotPoints).extend({
      createdAt: z.coerce.date(),
    }),
    environment: createSelectSchema(environments),
    humanUser: HumanUserDtoSchema,
  }),
});

export const HumanPostChainPlotPointSchema = z.object({
  type: z.literal("HUMAN_POST"),
  data: z.object({}),
});

export class HumanPostPlotPointDto extends createZodDto(
  HumanPostPlotPointDtoSchema,
) {}

/**
 * Union
 */
export const PlotPointDtoSchema = z.discriminatedUnion("type", [
  HumanMessagePlotPointDtoSchema,
  AiMessagePlotPointDtoSchema,
  EnvironmentEnteredPlotPointDtoSchema,
  EnvironmentLeftPlotPointDtoSchema,
  BibleVerseReferencePlotPointDtoSchema,
  PaliCanonReferencePlotPointDtoSchema,
  UserThemeSwitchedPlotPointDtoSchema,
  ThemeCreatedPlotPointDtoSchema,
  ThemesListedPlotPointDtoSchema,
  ThemeUpdatedPlotPointDtoSchema,
  HumanPostPlotPointDtoSchema,
]);

export const ChainPlotPointSchema = z.discriminatedUnion("type", [
  HumanMessageChainPlotPointSchema,
  AiMessageChainPlotPointSchema,
  EnvironmentEnteredChainPlotPointSchema,
  EnvironmentLeftChainPlotPointSchema,
  BibleVerseReferenceChainPlotPointDtoSchema,
  PaliCanonReferenceChainPlotPointDtoSchema,
  UserThemeSwitchedChainPlotPointSchema,
  ThemeCreatedChainPlotPointSchema,
  ThemesListedChainPlotPointSchema,
  ThemeUpdatedChainPlotPointSchema,
  HumanPostChainPlotPointSchema,
]);

export type ChainPlotPoint = z.infer<typeof ChainPlotPointSchema>;
export type PlotPointDto = z.infer<typeof PlotPointDtoSchema>;

/**
 * Filters
 */

const TypesArraySchema = z.preprocess(
  (val) => (val ? (Array.isArray(val) ? val : [val]) : undefined),
  z.array(z.enum(PLOT_POINT_TYPES)),
);

export const FilterPlotPointsDtoSchema = z.object({
  limit: z.coerce.number().optional(),
  types: TypesArraySchema.optional(),
  filter: TypesArraySchema.optional(),
  reverse: z.coerce.boolean().optional(),
});

export class FilterPlotPointsDto extends createZodDto(
  FilterPlotPointsDtoSchema,
) {}
