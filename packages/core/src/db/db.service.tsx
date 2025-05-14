import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import {
  AiMessages,
  AiUsers,
  AuthEmails,
  BibleVerses,
  EnvironmentAiTasks,
  EnvironmentUserLists,
  HumanMessages,
  HumanUsers,
  PlotPoints,
  Sessions,
  SpaceLists,
  UserEnvironmentPresences,
  Users,
  WorldRoomEnvironments,
} from "./services";
import { reset } from "drizzle-seed";
import { txt } from "../utils";
import { AppDBContext, DBContexts, LibraryDBContext } from "./db.types";
import * as appSchema from "./app.schema";

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
  public bibleVerses: BibleVerses;
  public environmentAiTasks: EnvironmentAiTasks;
  public environmentUserLists: EnvironmentUserLists;
  public humanMessages: HumanMessages;
  public humanUsers: HumanUsers;
  public plotPoints: PlotPoints;
  public sessions: Sessions;
  public spaceLists: SpaceLists;
  public userEnvironmentPresences: UserEnvironmentPresences;
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
    this.bibleVerses = new BibleVerses(this.contexts);
    this.environmentAiTasks = new EnvironmentAiTasks(this.contexts);
    this.environmentUserLists = new EnvironmentUserLists(this.contexts);
    this.humanMessages = new HumanMessages(this.contexts);
    this.humanUsers = new HumanUsers(this.contexts);
    this.plotPoints = new PlotPoints(this.contexts);
    this.sessions = new Sessions(this.contexts);
    this.spaceLists = new SpaceLists(this.contexts);
    this.userEnvironmentPresences = new UserEnvironmentPresences(this.contexts);
    this.users = new Users(this.contexts);
    this.worldRoomEnvironments = new WorldRoomEnvironments(this.contexts);
  }

  async clear() {
    await reset(this.contexts.app.drizzle, appSchema);
  }

  async seed() {
    await this.clear();

    // Environments
    const [universe] = await Promise.all([
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
    const [niko, note, why] = await Promise.all([
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
        id: "WHY",
        tag: "why",
        bio: txt(<>our general knowledge expert</>),
      }),
    ]);

    // Human Users
    const [jake] = await Promise.all([
      this.humanUsers.create({
        tag: "jake",
      }),
    ]);

    // Environment Presences
    await Promise.all([
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
        userId: why.userId,
      }),
      this.userEnvironmentPresences.create({
        environmentId: universe.environmentId,
        userId: jake.data.userId,
      }),
    ]);

    // Plot Points
    await this.aiMessages.create({
      userId: niko.userId,
      environmentId: universe.environmentId,
      content: "Welcome to the 2pm universe",
      state: "COMPLETE",
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
  }

  async end() {
    await Promise.all([
      this.contexts.app.pool.end(),
      this.contexts.library.pool.end(),
    ]);
  }
}
