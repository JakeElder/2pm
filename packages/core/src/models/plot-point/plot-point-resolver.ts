import { eq } from "drizzle-orm";
import {
  aiMessages,
  aiUsers,
  bibleVerseReferences,
  humanMessages,
  humanUsers,
  humanUserThemes,
  messages,
  paliCanonReferences,
  plotPointBibleVerseReferences,
  plotPointCreatedThemes,
  plotPointEnvironmentPresences,
  plotPointPaliCanonReferences,
  plotPoints,
  plotPointThemeLists,
  plotPointThemeSwitches,
  themeLists,
  themeListThemes,
  themes,
  themeUpdates,
  userEnvironmentPresences,
  users,
} from "../../db/app.schema";
import { DBContexts } from "../../db/db.types";
import HumanUsers from "../human-user/human-user.service";
import {
  AiMessagePlotPointDto,
  BibleVerseReferencePlotPointDto,
  EnvironmentEnteredPlotPointDto,
  EnvironmentLeftPlotPointDto,
  HumanMessagePlotPointDto,
  PaliCanonReferencePlotPointDto,
  ThemeCreatedPlotPointDto,
  ThemesListedPlotPointDto,
  ThemeUpdatedPlotPointDto,
  UserThemeSwitchedPlotPointDto,
} from "./plot-point.dto";
import { PlotPointRow } from "./plot-point.types";
import Users from "../user/user.service";
import {
  kjvBooks,
  kjvChunks,
  kjvVerses,
  paliCanonChunks,
} from "../../db/library.schema";

export class PlotPointResolver {
  static async humanMessage(
    { plotPoint, environment }: PlotPointRow,
    { app }: DBContexts,
  ): Promise<HumanMessagePlotPointDto> {
    const [row] = await app.drizzle
      .select({
        humanMessage: humanMessages,
        humanUser: humanUsers,
      })
      .from(messages)
      .innerJoin(humanMessages, eq(humanMessages.messageId, messages.id))
      .innerJoin(users, eq(users.id, messages.userId))
      .innerJoin(humanUsers, eq(humanUsers.userId, users.id))
      .where(eq(messages.plotPointId, plotPoint.id))
      .limit(1);

    const { humanUser, humanMessage } = row;

    if (!humanUser || !humanMessage) {
      throw new Error();
    }

    return {
      type: "HUMAN_MESSAGE",
      data: {
        environment,
        plotPoint,
        humanMessage,
        user: HumanUsers.discriminate(humanUser),
      },
    };
  }

  static async aiMessage(
    { plotPoint, environment }: PlotPointRow,
    { app }: DBContexts,
  ): Promise<AiMessagePlotPointDto> {
    const [row] = await app.drizzle
      .select({
        aiMessage: aiMessages,
        aiUser: aiUsers,
      })
      .from(messages)
      .innerJoin(aiMessages, eq(aiMessages.messageId, messages.id))
      .innerJoin(users, eq(users.id, messages.userId))
      .innerJoin(aiUsers, eq(aiUsers.userId, users.id))
      .where(eq(messages.plotPointId, plotPoint.id));

    const { aiUser, aiMessage } = row;

    if (!aiUser || !aiMessage) {
      throw new Error();
    }

    return {
      type: "AI_MESSAGE",
      data: {
        environment,
        plotPoint,
        aiMessage,
        aiUser,
      },
    };
  }

  static async environmentEntered(
    { plotPoint, environment }: PlotPointRow,
    { app }: DBContexts,
  ): Promise<EnvironmentEnteredPlotPointDto> {
    const [row] = await app.drizzle
      .select({
        user: users,
        aiUser: aiUsers,
        humanUser: humanUsers,
        userEnvironmentPresence: userEnvironmentPresences,
      })
      .from(plotPointEnvironmentPresences)
      .innerJoin(
        userEnvironmentPresences,
        eq(
          plotPointEnvironmentPresences.userEnvironmentPresenceId,
          userEnvironmentPresences.id,
        ),
      )
      .innerJoin(users, eq(users.id, userEnvironmentPresences.userId))
      .leftJoin(aiUsers, eq(aiUsers.userId, users.id))
      .leftJoin(humanUsers, eq(humanUsers.userId, users.id))
      .where(eq(plotPointEnvironmentPresences.plotPointId, plotPoint.id));

    const { user, aiUser, humanUser, userEnvironmentPresence } = row;

    return {
      type: "ENVIRONMENT_ENTERED",
      data: {
        environment,
        plotPoint,
        userEnvironmentPresence,
        user: Users.discriminate({ user, aiUser, humanUser }),
      },
    };
  }

  static async environmentLeft(
    { plotPoint, environment }: PlotPointRow,
    { app }: DBContexts,
  ): Promise<EnvironmentLeftPlotPointDto> {
    const [row] = await app.drizzle
      .select({
        user: users,
        aiUser: aiUsers,
        humanUser: humanUsers,
        userEnvironmentPresence: userEnvironmentPresences,
      })
      .from(plotPointEnvironmentPresences)
      .innerJoin(
        userEnvironmentPresences,
        eq(
          plotPointEnvironmentPresences.userEnvironmentPresenceId,
          userEnvironmentPresences.id,
        ),
      )
      .innerJoin(users, eq(users.id, userEnvironmentPresences.userId))
      .leftJoin(aiUsers, eq(aiUsers.userId, users.id))
      .leftJoin(humanUsers, eq(humanUsers.userId, users.id))
      .where(eq(plotPointEnvironmentPresences.plotPointId, plotPoint.id));

    const { user, aiUser, humanUser, userEnvironmentPresence } = row;

    return {
      type: "ENVIRONMENT_LEFT",
      data: {
        environment,
        plotPoint,
        userEnvironmentPresence,
        user: Users.discriminate({ user, aiUser, humanUser }),
      },
    };
  }

  static async bibleVerseReference(
    { plotPoint, environment }: PlotPointRow,
    { app, library }: DBContexts,
  ): Promise<BibleVerseReferencePlotPointDto> {
    const [{ bibleVerseReference }] = await app.drizzle
      .select({ bibleVerseReference: bibleVerseReferences })
      .from(plotPointBibleVerseReferences)
      .innerJoin(
        bibleVerseReferences,
        eq(
          bibleVerseReferences.id,
          plotPointBibleVerseReferences.bibleVerseReferenceId,
        ),
      )
      .where(eq(plotPointBibleVerseReferences.plotPointId, plotPoint.id));

    const [{ bibleVerse, bibleBook }] = await library.drizzle
      .select({
        bibleVerse: kjvVerses,
        bibleBook: kjvBooks,
      })
      .from(kjvVerses)
      .innerJoin(kjvBooks, eq(kjvVerses.bookId, kjvBooks.id))
      .where(eq(kjvVerses.id, bibleVerseReference.bibleVerseId));

    const [bibleChunk] = await library.drizzle
      .select()
      .from(kjvChunks)
      .where(eq(kjvChunks.id, bibleVerseReference.bibleChunkId));

    return {
      type: "BIBLE_VERSE_REFERENCE",
      data: {
        environment,
        plotPoint,
        bibleBook,
        bibleChunk,
        bibleVerse,
      },
    };
  }

  static async paliCanonReference(
    { plotPoint, environment }: PlotPointRow,
    { app, library }: DBContexts,
  ): Promise<PaliCanonReferencePlotPointDto> {
    const [{ paliCanonReference }] = await app.drizzle
      .select({ paliCanonReference: paliCanonReferences })
      .from(plotPointPaliCanonReferences)
      .innerJoin(
        paliCanonReferences,
        eq(
          paliCanonReferences.id,
          plotPointPaliCanonReferences.paliCanonReferenceId,
        ),
      )
      .where(eq(plotPointPaliCanonReferences.plotPointId, plotPoint.id));

    const [paliCanonChunk] = await library.drizzle
      .select()
      .from(paliCanonChunks)
      .where(eq(paliCanonChunks.id, paliCanonReference.paliCanonChunkId));

    return {
      type: "PALI_CANON_REFERENCE",
      data: {
        paliCanonChunk,
        environment,
        plotPoint,
      },
    };
  }

  static async userThemeSwitched(
    { plotPoint, environment }: PlotPointRow,
    { app }: DBContexts,
  ): Promise<UserThemeSwitchedPlotPointDto> {
    const [{ humanUser, plotPointThemeSwitch }] = await app.drizzle
      .select({
        humanUser: humanUsers,
        plotPointThemeSwitch: plotPointThemeSwitches,
      })
      .from(plotPoints)
      .innerJoin(users, eq(users.id, plotPoints.userId))
      .innerJoin(humanUsers, eq(humanUsers.userId, users.id))
      .innerJoin(
        plotPointThemeSwitches,
        eq(plotPointThemeSwitches.plotPointId, plotPoints.id),
      )
      .where(eq(plotPoints.id, plotPoint.id))
      .limit(1);

    if (!humanUser) {
      throw new Error();
    }

    const [{ humanUserTheme, currentTheme }] = await app.drizzle
      .select({ humanUserTheme: humanUserThemes, currentTheme: themes })
      .from(humanUserThemes)
      .innerJoin(themes, eq(humanUserThemes.themeId, themes.id))
      .where(eq(humanUserThemes.humanUserId, humanUser.id));

    const [[fromTheme], [toTheme]] = await Promise.all([
      app.drizzle
        .select()
        .from(themes)
        .where(eq(themes.id, plotPointThemeSwitch.fromThemeId)),
      app.drizzle
        .select()
        .from(themes)
        .where(eq(themes.id, plotPointThemeSwitch.toThemeId)),
    ]);

    return {
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
  }

  static async themesListed(
    { plotPoint, environment }: PlotPointRow,
    { app }: DBContexts,
  ): Promise<ThemesListedPlotPointDto> {
    const [{ themeList, humanUser }] = await app.drizzle
      .select({ themeList: themeLists, humanUser: humanUsers })
      .from(plotPoints)
      .innerJoin(users, eq(users.id, plotPoints.userId))
      .innerJoin(humanUsers, eq(humanUsers.userId, users.id))
      .innerJoin(
        plotPointThemeLists,
        eq(plotPointThemeLists.plotPointId, plotPoints.id),
      )
      .innerJoin(themeLists, eq(themeLists.id, plotPointThemeLists.themeListId))
      .where(eq(plotPoints.id, plotPoint.id));

    const listedThemes = await app.drizzle
      .select()
      .from(themes)
      .innerJoin(themeListThemes, eq(themes.id, themeListThemes.themeId))
      .innerJoin(themeLists, eq(themeLists.id, themeListThemes.themeListId))
      .where(eq(themeLists.id, themeList.id));

    const res: ThemesListedPlotPointDto = {
      type: "THEMES_LISTED",
      data: {
        environment,
        humanUser: HumanUsers.discriminate(humanUser),
        plotPoint,
        themes: listedThemes.map((l) => l.themes),
      },
    };

    return res;
  }

  static async themeCreated(
    { plotPoint, environment }: PlotPointRow,
    { app }: DBContexts,
  ): Promise<ThemeCreatedPlotPointDto> {
    const [{ theme, humanUser }] = await app.drizzle
      .select({ theme: themes, humanUser: humanUsers })
      .from(plotPoints)
      .innerJoin(users, eq(users.id, plotPoints.userId))
      .innerJoin(humanUsers, eq(humanUsers.userId, users.id))
      .innerJoin(
        plotPointCreatedThemes,
        eq(plotPointCreatedThemes.plotPointId, plotPoints.id),
      )
      .innerJoin(themes, eq(themes.id, plotPointCreatedThemes.themeId))
      .where(eq(plotPoints.id, plotPoint.id));

    return {
      type: "THEME_CREATED",
      data: {
        plotPoint,
        environment,
        theme,
        humanUser: HumanUsers.discriminate(humanUser),
      },
    };
  }

  static async themeUpdated(
    { plotPoint, environment }: PlotPointRow,
    { app }: DBContexts,
  ): Promise<ThemeUpdatedPlotPointDto> {
    const [{ theme, humanUser, themeUpdate }] = await app.drizzle
      .select({
        theme: themes,
        humanUser: humanUsers,
        themeUpdate: themeUpdates,
      })
      .from(plotPoints)
      .innerJoin(users, eq(users.id, plotPoints.userId))
      .innerJoin(humanUsers, eq(humanUsers.userId, users.id))
      .innerJoin(themeUpdates, eq(themeUpdates.plotPointId, plotPoints.id))
      .innerJoin(themes, eq(themes.id, themeUpdates.themeId))
      .where(eq(plotPoints.id, plotPoint.id));

    return {
      type: "THEME_UPDATED",
      data: {
        plotPoint,
        environment,
        patch: themeUpdate.patch,
        theme,
        humanUser: HumanUsers.discriminate(humanUser),
      },
    };
  }
}
