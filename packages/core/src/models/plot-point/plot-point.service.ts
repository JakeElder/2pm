import { asc, desc, eq, and, inArray, not } from "drizzle-orm";
import { DBServiceModule } from "../../db/db-service-module";
import { environments, plotPoints, users } from "../../db/app.schema";
import {
  AiMessagePlotPointDtoSchema,
  BibleVerseReferencePlotPointDtoSchema,
  ChainAiUser,
  ChainHumanUser,
  ChainPlotPoint,
  ChainUser,
  EnvironmentEnteredPlotPointDtoSchema,
  EnvironmentLeftPlotPointDtoSchema,
  FilterPlotPointsDto,
  HumanMessagePlotPointDtoSchema,
  PaliCanonReferencePlotPointDtoSchema,
  PlotPointDto,
  ThemeCreatedPlotPointDtoSchema,
  ThemesListedPlotPointDtoSchema,
  ThemeUpdatedPlotPointDtoSchema,
  UserThemeSwitchedPlotPointDtoSchema,
} from "./plot-point.dto";
import { DBContexts } from "../../db/db.types";
import { HumanUserDto } from "../human-user/human-user.types";
import { UserDto } from "../user/user.types";
import { AiUserDto } from "../ai-user/ai-user.dto";
import { PlotPointResolver } from "./plot-point-resolver";

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
  constructor(context: DBContexts) {
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
        environment: environments,
      })
      .from(plotPoints)
      .innerJoin(environments, eq(plotPoints.environmentId, environments.id))
      .innerJoin(users, eq(plotPoints.userId, users.id))
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
        const { plotPoint } = row;
        const { type } = plotPoint;
        const { app, library } = this;
        const contexts = { app, library };

        if (type === "HUMAN_MESSAGE") {
          const res = await PlotPointResolver.humanMessage(row, contexts);
          return HumanMessagePlotPointDtoSchema.parse(res);
        }

        if (type === "AI_MESSAGE") {
          const res = await PlotPointResolver.aiMessage(row, contexts);
          return AiMessagePlotPointDtoSchema.parse(res);
        }

        if (type === "ENVIRONMENT_ENTERED") {
          const res = await PlotPointResolver.environmentEntered(row, contexts);
          return EnvironmentEnteredPlotPointDtoSchema.parse(res);
        }

        if (type === "ENVIRONMENT_LEFT") {
          const res = await PlotPointResolver.environmentLeft(row, contexts);
          return EnvironmentLeftPlotPointDtoSchema.parse(res);
        }

        if (type === "BIBLE_VERSE_REFERENCE") {
          const res = await PlotPointResolver.bibleVerseReference(
            row,
            contexts,
          );
          return BibleVerseReferencePlotPointDtoSchema.parse(res);
        }

        if (type === "PALI_CANON_REFERENCE") {
          const res = await PlotPointResolver.paliCanonReference(row, contexts);
          return PaliCanonReferencePlotPointDtoSchema.parse(res);
        }

        if (type === "USER_THEME_SWITCHED") {
          const res = await PlotPointResolver.userThemeSwitched(row, contexts);
          return UserThemeSwitchedPlotPointDtoSchema.parse(res);
        }

        if (type === "THEMES_LISTED") {
          const res = await PlotPointResolver.themesListed(row, contexts);
          return ThemesListedPlotPointDtoSchema.parse(res);
        }

        if (type === "THEME_CREATED") {
          const res = await PlotPointResolver.themeCreated(row, contexts);
          return ThemeCreatedPlotPointDtoSchema.parse(res);
        }

        if (type === "THEME_UPDATED") {
          const res = await PlotPointResolver.themeUpdated(row, contexts);
          return ThemeUpdatedPlotPointDtoSchema.parse(res);
        }

        throw new Error(`${type} not implemented`);
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

    if (type === "PALI_CANON_REFERENCE") {
      return {
        type,
        data: {
          author: data.paliCanonChunk.metadata.author_uid,
          basket: data.paliCanonChunk.metadata.basket,
          passage: data.paliCanonChunk.content,
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

    if (type === "THEME_CREATED") {
      return {
        type,
        data: {
          date: data.plotPoint.createdAt,
          user: chainHumanUser(data.humanUser),
          theme: data.theme,
        },
      };
    }

    if (type === "THEMES_LISTED") {
      return {
        type,
        data: {
          date: data.plotPoint.createdAt,
          user: chainHumanUser(data.humanUser),
          themeIds: data.themes.map((t) => t.id),
        },
      };
    }

    if (type === "THEME_UPDATED") {
      return {
        type,
        data: {
          date: data.plotPoint.createdAt,
          user: chainHumanUser(data.humanUser),
          patch: data.patch,
          theme: data.theme,
        },
      };
    }

    throw new Error(`${type} not implemented`);
  }

  static toChain(plotPoints: PlotPointDto[]): ChainPlotPoint[] {
    return plotPoints.map(PlotPoints.toChainPlotPoint);
  }
}
