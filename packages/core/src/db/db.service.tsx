import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import {
  AiMessages,
  AiUsers,
  AuthEmails,
  BibleChunks,
  BibleVerseReferences,
  BibleVerses,
  EnvironmentAiTasks,
  EnvironmentUserLists,
  HumanMessages,
  HumanPosts,
  HumanUserRoomEnvironments,
  HumanUserThemes,
  HumanUsers,
  PaliCanonPassages,
  PaliCanonReferences,
  PlotPoints,
  Sessions,
  SpaceLists,
  ThemeLists,
  Themes,
  UserEnvironmentPresences,
  UserSpaceLists,
  Users,
  WorldRoomEnvironments,
} from "./services";
import { reset } from "drizzle-seed";
import { txt } from "../utils";
import { AppDBContext, DBContexts, LibraryDBContext } from "./db.types";
import * as appSchema from "./app.schema";
import { DEFAULT_THEMES } from "../models/theme/theme.constants";

type Props = {
  appDatabaseUrl: string;
  libraryDatabaseUrl: string;
};

export class DBService {
  public app: AppDBContext;
  public library: LibraryDBContext;

  private contexts: DBContexts;

  public aiMessages: AiMessages;
  public aiUsers: AiUsers;
  public authEmails: AuthEmails;
  public bibleChunks: BibleChunks;
  public bibleVerseReferences: BibleVerseReferences;
  public bibleVerses: BibleVerses;
  public environmentAiTasks: EnvironmentAiTasks;
  public environmentUserLists: EnvironmentUserLists;
  public humanMessages: HumanMessages;
  public humanPosts: HumanPosts;
  public humanUserRoomEnvironments: HumanUserRoomEnvironments;
  public humanUserThemes: HumanUserThemes;
  public humanUsers: HumanUsers;
  public paliCanonPassages: PaliCanonPassages;
  public paliCanonReferences: PaliCanonReferences;
  public plotPoints: PlotPoints;
  public sessions: Sessions;
  public spaceLists: SpaceLists;
  public themeLists: ThemeLists;
  public themes: Themes;
  public userEnvironmentPresences: UserEnvironmentPresences;
  public userSpaceLists: UserSpaceLists;
  public users: Users;
  public worldRoomEnvironments: WorldRoomEnvironments;

  constructor({ appDatabaseUrl, libraryDatabaseUrl }: Props) {
    const appPool = new Pool({ connectionString: appDatabaseUrl });
    const libraryPool = new Pool({ connectionString: libraryDatabaseUrl });

    this.app = {
      pool: appPool,
      drizzle: drizzle({ client: appPool }),
    };

    this.library = {
      pool: libraryPool,
      drizzle: drizzle({ client: libraryPool }),
    };

    this.contexts = {
      app: this.app,
      library: this.library,
    };

    (() => {
      const { drizzle } = this.app;
      drizzle.transaction = drizzle.transaction.bind(drizzle);
    })();

    (() => {
      const { drizzle } = this.library;
      drizzle.transaction = drizzle.transaction.bind(drizzle);
    })();

    this.aiMessages = new AiMessages(this.contexts);
    this.aiUsers = new AiUsers(this.contexts);
    this.authEmails = new AuthEmails(this.contexts);
    this.bibleChunks = new BibleChunks(this.contexts);
    this.bibleVerseReferences = new BibleVerseReferences(this.contexts);
    this.bibleVerses = new BibleVerses(this.contexts);
    this.environmentAiTasks = new EnvironmentAiTasks(this.contexts);
    this.environmentUserLists = new EnvironmentUserLists(this.contexts);
    this.humanMessages = new HumanMessages(this.contexts);
    this.humanPosts = new HumanPosts(this.contexts);
    this.humanUserRoomEnvironments = new HumanUserRoomEnvironments(
      this.contexts,
    );
    this.humanUserThemes = new HumanUserThemes(this.contexts);
    this.humanUsers = new HumanUsers(this.contexts);
    this.paliCanonPassages = new PaliCanonPassages(this.contexts);
    this.paliCanonReferences = new PaliCanonReferences(this.contexts);
    this.plotPoints = new PlotPoints(this.contexts);
    this.sessions = new Sessions(this.contexts);
    this.spaceLists = new SpaceLists(this.contexts);
    this.themeLists = new ThemeLists(this.contexts);
    this.themes = new Themes(this.contexts);
    this.userEnvironmentPresences = new UserEnvironmentPresences(this.contexts);
    this.userSpaceLists = new UserSpaceLists(this.contexts);
    this.users = new Users(this.contexts);
    this.worldRoomEnvironments = new WorldRoomEnvironments(this.contexts);
  }

  async clear() {
    await reset(this.contexts.app.drizzle, appSchema);
  }

  async seed() {
    await this.clear();

    // World Room Environments
    const [universe, campfire] = await Promise.all([
      this.worldRoomEnvironments.create({
        id: "UNIVERSE",
        slug: "universe",
        order: 1,
      }),
      this.worldRoomEnvironments.create({
        id: "CAMPFIRE",
        slug: "campfire",
        order: 2,
      }),
      this.worldRoomEnvironments.create({
        id: "ABOUT",
        slug: "about-2pm",
        order: 3,
      }),
    ]);

    // Ai Users
    const [niko, note, tiny, albert, prose] = await Promise.all([
      this.aiUsers.create({
        id: "NIKO",
        tag: "niko",
        bio: txt(<>our host and ancient text expert</>),
      }),
      this.aiUsers.create({
        id: "NOTE",
        tag: "note",
        bio: txt(<>an expert on buddhist teachings</>),
      }),
      this.aiUsers.create({
        id: "TINY",
        tag: "tiny",
        bio: txt(<>helps with config and small tasks</>),
      }),
      this.aiUsers.create({
        id: "ALBERT",
        tag: "albert",
        bio: txt(<>veteran physics and maths smarty</>),
      }),
      this.aiUsers.create({
        id: "PROSE",
        tag: "prose",
        bio: txt(<>creative story teller</>),
      }),
    ]);

    // Themes
    await Promise.all([
      this.themes.createDefault(DEFAULT_THEMES.dark),
      this.themes.createDefault(DEFAULT_THEMES.light),
    ]);

    // Human Users
    const [jake] = await Promise.all([
      this.humanUsers.create({
        tag: "jake",
      }),
    ]);

    // Human User Room Environments
    const [photography] = await Promise.all([
      this.humanUserRoomEnvironments.create({
        userId: jake.data.userId,
        order: 2,
        slug: "street-photography",
      }),
      this.humanUserRoomEnvironments.create({
        userId: jake.data.userId,
        order: 1,
        slug: "home",
      }),
      this.humanUserRoomEnvironments.create({
        userId: jake.data.userId,
        order: 3,
        slug: "food",
      }),
      this.humanUserRoomEnvironments.create({
        userId: jake.data.userId,
        order: 4,
        slug: "fitness",
      }),
      this.humanUserRoomEnvironments.create({
        userId: jake.data.userId,
        order: 5,
        slug: "chiang-mai",
      }),
      this.humanUserRoomEnvironments.create({
        userId: jake.data.userId,
        order: 6,
        slug: "music",
      }),
    ]);

    // Environment Presences
    await Promise.all([
      // Universe
      this.userEnvironmentPresences.create({
        environmentId: universe.environmentId,
        userId: niko.userId,
      }),
      this.userEnvironmentPresences.create({
        environmentId: universe.environmentId,
        userId: note.userId,
      }),
      this.userEnvironmentPresences.create({
        environmentId: universe.environmentId,
        userId: tiny.userId,
      }),
      // Photography
      this.userEnvironmentPresences.create({
        environmentId: photography.environmentId,
        userId: niko.userId,
      }),
      this.userEnvironmentPresences.create({
        environmentId: photography.environmentId,
        userId: note.userId,
      }),
      this.userEnvironmentPresences.create({
        environmentId: photography.environmentId,
        userId: tiny.userId,
      }),
    ]);

    // Plot Points
    await this.aiMessages.create({
      userId: niko.userId,
      environmentId: universe.environmentId,
      content: "Welcome to the 2pm universe",
      state: "COMPLETE",
    });

    await this.humanPosts.create({
      userId: jake.data.userId,
      environmentId: photography.environmentId,
    });

    await this.humanMessages.create({
      userId: jake.data.userId,
      environmentId: universe.environmentId,
      text: "thank you sir",
      json: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "thank you ",
              },
              {
                type: "text",
                marks: [{ type: "bold" }],
                text: "sir",
              },
            ],
          },
        ],
      },
    });

    // await this.bibleVerseReferences.create({
    //   bibleVerseId: 13127,
    //   bibleChunkId: 13127,
    //   environmentId: universe.environmentId,
    //   userId: niko.userId,
    // });

    // await this.bibleVerseReferences.create({
    //   bibleVerseId: 28054,
    //   bibleChunkId: 28054,
    //   environmentId: universe.environmentId,
    //   userId: niko.userId,
    // });

    // await this.bibleVerseReferences.create({
    //   bibleVerseId: 30171,
    //   bibleChunkId: 30171,
    //   environmentId: universe.environmentId,
    //   userId: niko.userId,
    // });

    // await this.paliCanonReferences.create({
    //   environmentId: universe.environmentId,
    //   paliCanonChunkId: 68969,
    //   userId: jake.data.userId,
    // });

    // await this.paliCanonReferences.create({
    //   environmentId: universe.environmentId,
    //   paliCanonChunkId: 81747,
    //   userId: jake.data.userId,
    // });
  }

  async end() {
    await Promise.all([
      this.contexts.app.pool.end(),
      this.contexts.library.pool.end(),
    ]);
  }
}
