import { asc, desc, eq, and, inArray, not } from "drizzle-orm";
import { DBServiceModule } from "../../db/db-service-module";
import {
  aiMessages,
  aiUsers,
  bibleVerseReferences,
  environments,
  humanMessages,
  humanUsers,
  humanUserThemes,
  messages,
  plotPointBibleVerseReferences,
  plotPointEnvironmentPresences,
  plotPoints,
  plotPointThemeSwitches,
  themes,
  userEnvironmentPresences,
  users,
} from "../../db/app.schema";
import {
  AiMessagePlotPointDto,
  AiMessagePlotPointDtoSchema,
  BibleVerseReferencePlotPointDto,
  BibleVerseReferencePlotPointDtoSchema,
  ChainAiUser,
  ChainHumanUser,
  ChainPlotPoint,
  ChainUser,
  EnvironmentEnteredPlotPointDto,
  EnvironmentEnteredPlotPointDtoSchema,
  EnvironmentLeftPlotPointDto,
  EnvironmentLeftPlotPointDtoSchema,
  FilterPlotPointsDto,
  HumanMessagePlotPointDto,
  HumanMessagePlotPointDtoSchema,
  PlotPointDto,
  UserThemeSwitchedPlotPointDto,
} from "./plot-point.dto";
import { HumanMessageDtoSchema } from "../human-message/human-message.dto";
import { AiMessageDtoSchema } from "../ai-message/ai-message.dto";
import Users from "../user/user.service";
import HumanUsers from "../human-user/human-user.service";
import { DBContexts } from "../../db/db.types";
import BibleChunks from "../bible-chunk/bible-chunk.service";
import BibleVerses from "../bible-verse/bible-verse.service";
import { HumanUserDto } from "../human-user/human-user.types";
import { UserDto } from "../user/user.types";
import { AiUserDto } from "../ai-user/ai-user.dto";

const chainHumanUser = (user: HumanUserDto): ChainHumanUser => {
  const tag =
    user.type === "ANONYMOUS" ? `anon#${user.data.hash}` : user.data.tag!;

  return {
    type: user.type,
    id: user.data.userId,
    tag,
  };
};

const chainAiUser = (user: AiUserDto): ChainAiUser => {
  return {
    type: "AI",
    id: user.userId,
    tag: user.tag,
  };
};

const chainUser = (user: UserDto): ChainUser => {
  return user.type === "AI" ? chainAiUser(user.data) : chainHumanUser(user);
};

export default class PlotPoints extends DBServiceModule {
  constructor(
    context: DBContexts,
    private bibleChunks: BibleChunks,
    private bibleVerses: BibleVerses,
  ) {
    super(context);
  }

  async findByEnvironmentId(id: number, options: FilterPlotPointsDto = {}) {
    const { limit, types, filter, reverse } = options;

    const order = reverse
      ? asc(plotPoints.createdAt)
      : desc(plotPoints.createdAt);

    const query = this.app.drizzle
      .select({
        plotPoint: plotPoints,
        message: messages,
        humanMessage: humanMessages,
        aiMessage: aiMessages,
        user: users,
        humanUser: humanUsers,
        aiUser: aiUsers,
        environment: environments,
        plotPointEnvironmentPresence: plotPointEnvironmentPresences,
        plotPointBibleVerseReferences: plotPointBibleVerseReferences,
        plotPointThemeSwitches: plotPointThemeSwitches,
        userEnvironmentPresence: userEnvironmentPresences,
        bibleVerseReference: bibleVerseReferences,
      })
      .from(plotPoints)
      .innerJoin(users, eq(plotPoints.userId, users.id))
      .innerJoin(environments, eq(plotPoints.environmentId, environments.id))
      .leftJoin(messages, eq(messages.plotPointId, plotPoints.id))
      .leftJoin(humanMessages, eq(messages.id, humanMessages.messageId))
      .leftJoin(aiMessages, eq(messages.id, aiMessages.messageId))
      .leftJoin(humanUsers, eq(users.id, humanUsers.userId))
      .leftJoin(aiUsers, eq(users.id, aiUsers.userId))
      .leftJoin(
        plotPointEnvironmentPresences,
        eq(plotPoints.id, plotPointEnvironmentPresences.plotPointId),
      )
      .leftJoin(
        userEnvironmentPresences,
        eq(
          plotPointEnvironmentPresences.userEnvironmentPresenceId,
          userEnvironmentPresences.id,
        ),
      )
      .leftJoin(
        plotPointBibleVerseReferences,
        eq(plotPoints.id, plotPointBibleVerseReferences.plotPointId),
      )
      .leftJoin(
        bibleVerseReferences,
        eq(
          plotPointBibleVerseReferences.bibleVerseReferenceId,
          bibleVerseReferences.id,
        ),
      )
      .leftJoin(
        plotPointThemeSwitches,
        eq(plotPoints.id, plotPointThemeSwitches.plotPointId),
      )
      .where(
        and(
          eq(plotPoints.environmentId, id),
          types && types.length > 0
            ? inArray(plotPoints.type, types)
            : undefined,
          filter && filter.length > 0
            ? not(inArray(plotPoints.type, filter))
            : undefined,
        ),
      )
      .orderBy(order);

    if (limit) {
      query.limit(limit);
    }

    const res = await query;

    const data: PlotPointDto[] = await Promise.all(
      res.map(async (row) => {
        if (row.plotPoint.type === "HUMAN_MESSAGE") {
          const { humanUser, humanMessage, message } = row;

          if (!humanUser || !humanMessage || !message) {
            throw new Error();
          }

          const res: HumanMessagePlotPointDto = {
            type: "HUMAN_MESSAGE",
            data: HumanMessageDtoSchema.parse({
              ...row,
              user: HumanUsers.discriminate(humanUser),
            }),
          };

          return HumanMessagePlotPointDtoSchema.parse(res);
        }

        if (row.plotPoint.type === "AI_MESSAGE") {
          const { aiUser, aiMessage, message } = row;

          if (!aiUser || !aiMessage || !message) {
            throw new Error();
          }

          const res: AiMessagePlotPointDto = {
            type: "AI_MESSAGE",
            data: AiMessageDtoSchema.parse(row),
          };

          return AiMessagePlotPointDtoSchema.parse(res);
        }

        if (row.plotPoint.type === "ENVIRONMENT_ENTERED") {
          const { userEnvironmentPresence } = row;

          if (!userEnvironmentPresence) {
            throw new Error();
          }

          const res: EnvironmentEnteredPlotPointDto = {
            type: "ENVIRONMENT_ENTERED",
            data: {
              ...row,
              userEnvironmentPresence,
              user: Users.discriminate(row),
            },
          };

          return EnvironmentEnteredPlotPointDtoSchema.parse(res);
        }

        if (row.plotPoint.type === "ENVIRONMENT_LEFT") {
          const { userEnvironmentPresence } = row;

          if (!userEnvironmentPresence) {
            throw new Error();
          }

          const res: EnvironmentLeftPlotPointDto = {
            type: "ENVIRONMENT_LEFT",
            data: {
              ...row,
              userEnvironmentPresence,
              user: Users.discriminate(row),
            },
          };

          return EnvironmentLeftPlotPointDtoSchema.parse(res);
        }

        if (row.plotPoint.type === "BIBLE_VERSE_REFERENCE") {
          const { bibleVerseReference, environment, plotPoint } = row;

          if (!bibleVerseReference) {
            throw new Error();
          }

          const [bibleChunk, bibleVerse] = await Promise.all([
            this.bibleChunks.find(bibleVerseReference.bibleChunkId),
            this.bibleVerses.find(bibleVerseReference.bibleVerseId),
          ]);

          if (!bibleChunk || !bibleVerse) {
            throw new Error();
          }

          const res: BibleVerseReferencePlotPointDto = {
            type: "BIBLE_VERSE_REFERENCE",
            data: {
              ...bibleVerse,
              bibleChunk,
              environment,
              plotPoint,
            },
          };

          return BibleVerseReferencePlotPointDtoSchema.parse(res);
        }

        if (row.plotPoint.type === "USER_THEME_SWITCHED") {
          const { plotPointThemeSwitches, humanUser, plotPoint, environment } =
            row;

          if (!plotPointThemeSwitches || !humanUser) {
            throw new Error();
          }

          const [{ humanUserTheme, currentTheme }] = await this.app.drizzle
            .select({ humanUserTheme: humanUserThemes, currentTheme: themes })
            .from(humanUserThemes)
            .innerJoin(themes, eq(humanUserThemes.themeId, themes.id))
            .where(eq(humanUserThemes.humanUserId, humanUser.id));

          const [[fromTheme], [toTheme]] = await Promise.all([
            this.app.drizzle
              .select()
              .from(themes)
              .where(eq(themes.id, plotPointThemeSwitches.fromThemeId)),
            this.app.drizzle
              .select()
              .from(themes)
              .where(eq(themes.id, plotPointThemeSwitches.toThemeId)),
          ]);

          const res: UserThemeSwitchedPlotPointDto = {
            type: "USER_THEME_SWITCHED",
            data: {
              plotPoint,
              environment,
              from: fromTheme,
              to: toTheme,
              humanUserTheme: {
                id: humanUserTheme.id,
                theme: currentTheme,
                humanUser: HumanUsers.discriminate(humanUser),
              },
            },
          };

          return res;
        }

        throw new Error(`${row.plotPoint.type} not implemented`);
      }),
    );

    return data;
  }

  static toChainPlotPoint({ type, data }: PlotPointDto): ChainPlotPoint {
    if (type === "HUMAN_MESSAGE") {
      return {
        type,
        data: {
          user: chainHumanUser(data.user),
          message: data.humanMessage.text,
          date: data.plotPoint.createdAt,
        },
      };
    }

    if (type === "AI_MESSAGE") {
      return {
        type,
        data: {
          user: chainAiUser(data.aiUser),
          message: data.aiMessage.content,
          date: data.plotPoint.createdAt,
        },
      };
    }

    if (type === "ENVIRONMENT_ENTERED" || type === "ENVIRONMENT_LEFT") {
      return {
        type,
        data: {
          user: chainUser(data.user),
          date: data.plotPoint.createdAt,
        },
      };
    }

    if (type === "BIBLE_VERSE_REFERENCE") {
      return {
        type,
        data: {
          passage: data.bibleChunk.content,
          verse: data.bibleVerse,
          date: data.plotPoint.createdAt,
        },
      };
    }

    if (type === "USER_THEME_SWITCHED") {
      return {
        type,
        data: {
          date: data.plotPoint.createdAt,
          user: chainUser(data.humanUserTheme.humanUser),
          fromThemeId: data.from.id,
          toThemeId: data.to.id,
        },
      };
    }

    throw new Error(`${type} not implemented`);
  }

  static toChain(plotPoints: PlotPointDto[]): ChainPlotPoint[] {
    return plotPoints.map(PlotPoints.toChainPlotPoint);
  }
}
