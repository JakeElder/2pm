import {
  Drizzle,
  InsertAiUserValues,
  InsertAiUserResponse,
  InsertUserEnvironmentPresenceValues,
  InsertUserEnvironmentPresenceResponse,
  InsertHumanUserValues,
  InsertHumanUserResponse,
  InsertMessageValues,
  InsertMessageResponse,
  InsertWorldRoomValues,
  InsertWorldRoomResponse,
  InsertCompanionOneToOneValues,
  InsertCompanionOneToOneResponse,
} from "@2pm/schemas";
import {
  users,
  plotPoints,
  environments,
  worldRooms,
  environmentWorldRooms,
  userPlotPoints,
  plotPointMessages,
  messages,
  humanUsers,
  aiUsers,
  userEnvironmentPresences,
  companionOneToOnes,
  environmentCompanionOneToOnes,
} from "@2pm/schemas/drizzle";

export default class Utils {
  private drizzle: Drizzle;

  constructor(drizzle: Drizzle) {
    this.drizzle = drizzle;
    this.drizzle.delete = this.drizzle.delete.bind(this.drizzle);
    this.drizzle.transaction = this.drizzle.transaction.bind(this.drizzle);
  }

  public async nuke() {
    const { delete: rm } = this.drizzle;

    await Promise.all([
      rm(environmentWorldRooms),
      rm(userPlotPoints),
      rm(plotPointMessages),
      rm(userEnvironmentPresences),
      rm(environmentCompanionOneToOnes),
      rm(aiUsers),
      rm(humanUsers),
    ]);

    await Promise.all([
      rm(messages),
      rm(users),
      rm(plotPoints),
      rm(environments),
      rm(worldRooms),
      rm(companionOneToOnes),
    ]);
  }

  public async insertCompanionOneToOne(
    values: InsertCompanionOneToOneValues,
  ): Promise<InsertCompanionOneToOneResponse> {
    const { transaction } = this.drizzle;

    return transaction(async (tx) => {
      const [environment] = await tx
        .insert(environments)
        .values({ ...values.environment, type: "COMPANION_ONE_TO_ONE" })
        .returning();

      const [companionOneToOne] = await tx
        .insert(companionOneToOnes)
        .values(values.companionOneToOne)
        .returning();

      const [environmentCompanionOneToOne] = await tx
        .insert(environmentCompanionOneToOnes)
        .values({
          environmentId: environment.id,
          companionOneToOneId: companionOneToOne.id,
        })
        .returning();

      return { environment, companionOneToOne, environmentCompanionOneToOne };
    });
  }

  public async insertWorldRoom(
    values: InsertWorldRoomValues,
  ): Promise<InsertWorldRoomResponse> {
    const { transaction } = this.drizzle;

    return transaction(async (tx) => {
      const [environment] = await tx
        .insert(environments)
        .values({ ...values.environment, type: "WORLD_ROOM" })
        .returning();

      const [worldRoom] = await tx
        .insert(worldRooms)
        .values(values.worldRoom)
        .returning();

      const [environmentWorldRoom] = await tx
        .insert(environmentWorldRooms)
        .values({ environmentId: environment.id, worldRoomId: worldRoom.id })
        .returning();

      return { environment, worldRoom, environmentWorldRoom };
    });
  }

  public async insertHumanUser(
    values: InsertHumanUserValues,
  ): Promise<InsertHumanUserResponse> {
    const { transaction } = this.drizzle;

    return transaction(async (tx) => {
      const [user] = await tx
        .insert(users)
        .values({ ...values.user, type: "HUMAN" })
        .returning();

      const [humanUser] = await tx
        .insert(humanUsers)
        .values({
          userId: user.id,
          locationEnvironmentId: values.location.id,
        })
        .returning();

      return { user, humanUser };
    });
  }

  public async insertAiUser(
    values: InsertAiUserValues,
  ): Promise<InsertAiUserResponse> {
    const { transaction } = this.drizzle;

    return transaction(async (tx) => {
      const [user] = await tx
        .insert(users)
        .values({ ...values.user, type: "AI" })
        .returning();

      const [aiUser] = await tx
        .insert(aiUsers)
        .values({ code: values.aiUser.code, userId: user.id })
        .returning();

      return { user, aiUser };
    });
  }

  public async insertMessage(
    values: InsertMessageValues,
  ): Promise<InsertMessageResponse> {
    const { transaction } = this.drizzle;

    return transaction(async (tx) => {
      const [plotPoint] = await tx
        .insert(plotPoints)
        .values({ ...values.plotPoint, type: "AI_MESSAGE" })
        .returning();

      const [message] = await tx
        .insert(messages)
        .values(values.message)
        .returning();

      const [userPlotPoint] = await tx
        .insert(userPlotPoints)
        .values({ userId: values.user.id, plotPointId: plotPoint.id })
        .returning();

      const [plotPointMessage] = await tx.insert(plotPointMessages).values({
        plotPointId: plotPoint.id,
        messageId: message.id,
      });

      return { plotPoint, message, userPlotPoint, plotPointMessage };
    });
  }

  public async insertUserEnvironmentPresence(
    values: InsertUserEnvironmentPresenceValues,
  ): Promise<InsertUserEnvironmentPresenceResponse> {
    const [userEnvironmentPresence] = await this.drizzle
      .insert(userEnvironmentPresences)
      .values({ userId: values.user.id, environmentId: values.environment.id })
      .returning();
    return { userEnvironmentPresence };
  }

  public async seed() {
    await this.nuke();

    const universe = await this.insertWorldRoom({
      worldRoom: { code: "UNIVERSE" },
    });

    const [g, ivan, jake] = await Promise.all([
      this.insertAiUser({
        user: { tag: "g" },
        aiUser: { code: "G" },
      }),
      this.insertAiUser({
        user: { tag: "ivan" },
        aiUser: { code: "IVAN" },
      }),
      this.insertHumanUser({
        user: { tag: "jake" },
        location: { ...universe.environment },
      }),
    ]);

    const o2o = await this.insertCompanionOneToOne({
      companionOneToOne: {},
    });

    await this.insertUserEnvironmentPresence({ ...g, ...universe });

    await Promise.all([
      this.insertUserEnvironmentPresence({ ...ivan, ...o2o }),
      this.insertUserEnvironmentPresence({ ...jake, ...o2o }),
    ]);

    await this.insertMessage({
      ...g,
      plotPoint: { type: "AI_MESSAGE" },
      message: {
        content: "Standby for G stuff",
        userId: g.user.id,
        environmentId: universe.environment.id,
      },
    });

    await this.insertMessage({
      ...ivan,
      plotPoint: { type: "HUMAN_MESSAGE" },
      message: {
        content: "Welcome back friend. Let's get you authenticated",
        userId: ivan.user.id,
        environmentId: o2o.environment.id,
      },
    });
  }
}
