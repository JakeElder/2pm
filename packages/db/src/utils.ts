import {
  Drizzle,
  InsertAiUserValues,
  InsertAiUserResponse,
  InsertUserEnvironmentPresenceValues,
  InsertUserEnvironmentPresenceResponse,
  InsertHumanUserValues,
  InsertHumanUserResponse,
  InsertWorldRoomValues,
  InsertWorldRoomResponse,
  InsertCompanionOneToOneValues,
  InsertCompanionOneToOneResponse,
  InsertAiMessageValues,
  InsertAiMessageResponse,
} from "@2pm/schemas";
import {
  users,
  plotPoints,
  environments,
  worldRooms,
  environmentWorldRooms,
  plotPointMessages,
  messages,
  humanUsers,
  aiUsers,
  userEnvironmentPresences,
  companionOneToOnes,
  environmentCompanionOneToOnes,
  aiMessages,
  humanMessages,
  plotPointEnvironmentPresences,
} from "@2pm/schemas/drizzle";

export default class Utils {
  private drizzle: Drizzle;

  constructor(drizzle: Drizzle) {
    this.drizzle = drizzle;
    this.drizzle.delete = this.drizzle.delete.bind(this.drizzle);
    this.drizzle.transaction = this.drizzle.transaction.bind(this.drizzle);
  }

  public async clear() {
    const { delete: rm } = this.drizzle;

    // Truncate dependent tables first
    await rm(plotPointEnvironmentPresences);
    await rm(plotPointMessages);
    await rm(userEnvironmentPresences);
    await rm(environmentCompanionOneToOnes);
    await rm(environmentWorldRooms);

    // Truncate tables that depend on users or messages
    await rm(aiMessages);
    await rm(humanMessages);
    await rm(aiUsers);
    await rm(humanUsers);

    // Truncate parent tables
    await rm(messages);
    await rm(plotPoints);
    await rm(users);

    // Truncate remaining independent tables
    await rm(companionOneToOnes);
    await rm(worldRooms);
    await rm(environments);
  }

  public async insertCompanionOneToOne(
    _?: InsertCompanionOneToOneValues,
  ): Promise<InsertCompanionOneToOneResponse> {
    const { transaction } = this.drizzle;

    return transaction(async (tx) => {
      const [environment] = await tx
        .insert(environments)
        .values({ type: "COMPANION_ONE_TO_ONE" })
        .returning();

      const [companionOneToOne] = await tx
        .insert(companionOneToOnes)
        .values({})
        .returning();

      const [environmentCompanionOneToOne] = await tx
        .insert(environmentCompanionOneToOnes)
        .values({
          environmentId: environment.id,
          companionOneToOneId: companionOneToOne.id,
        })
        .returning();

      return {
        environment,
        companionOneToOne,
        environmentCompanionOneToOne,
      };
    });
  }

  public async insertWorldRoom(
    values: InsertWorldRoomValues,
  ): Promise<InsertWorldRoomResponse> {
    const { transaction } = this.drizzle;

    return transaction(async (tx) => {
      const [environment] = await tx
        .insert(environments)
        .values({ type: "WORLD_ROOM" })
        .returning();

      const [worldRoom] = await tx
        .insert(worldRooms)
        .values({ code: values.worldRoom.code })
        .returning();

      const [environmentWorldRoom] = await tx
        .insert(environmentWorldRooms)
        .values({
          environmentId: environment.id,
          worldRoomId: worldRoom.id,
        })
        .returning();

      return {
        environment,
        worldRoom,
        environmentWorldRoom,
      };
    });
  }

  public async insertHumanUser(
    values: InsertHumanUserValues,
  ): Promise<InsertHumanUserResponse> {
    const { transaction } = this.drizzle;

    return transaction(async (tx) => {
      const [user] = await tx
        .insert(users)
        .values({
          type: "HUMAN",
          tag: values.user.tag,
        })
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
        .values({
          type: "AI",
          tag: values.user.tag,
        })
        .returning();

      const [aiUser] = await tx
        .insert(aiUsers)
        .values({
          userId: user.id,
          code: values.aiUser.code,
        })
        .returning();

      return { user, aiUser };
    });
  }

  public async insertAiMessage(
    values: InsertAiMessageValues,
  ): Promise<InsertAiMessageResponse> {
    return this.drizzle.transaction(async (tx) => {
      const [plotPoint] = await tx
        .insert(plotPoints)
        .values({
          type: "MESSAGE_SENT",
          userId: values.user.id,
          environmentId: values.environment.id,
        })
        .returning();

      const [message] = await tx
        .insert(messages)
        .values({
          type: "AI",
          content: values.message.content,
          userId: values.user.id,
          environmentId: values.environment.id,
        })
        .returning();

      const [aiMessage] = await tx
        .insert(aiMessages)
        .values({ messageId: message.id })
        .returning();

      const [plotPointMessage] = await tx
        .insert(plotPointMessages)
        .values({
          plotPointId: plotPoint.id,
          messageId: message.id,
        })
        .returning();

      return {
        plotPoint,
        plotPointMessage,
        message,
        aiMessage,
      };
    });
  }

  public async insertUserEnvironmentPresence(
    values: InsertUserEnvironmentPresenceValues,
  ): Promise<InsertUserEnvironmentPresenceResponse> {
    return this.drizzle.transaction(async (tx) => {
      const [plotPoint] = await tx
        .insert(plotPoints)
        .values({
          type: "ENVIRONMENT_ENTERED",
          environmentId: values.environment.id,
          userId: values.user.id,
        })
        .returning();

      const [userEnvironmentPresence] = await this.drizzle
        .insert(userEnvironmentPresences)
        .values({
          userId: values.user.id,
          environmentId: values.environment.id,
        })
        .returning();

      const [plotPointEnvironmentPresence] = await tx
        .insert(plotPointEnvironmentPresences)
        .values({
          plotPointId: plotPoint.id,
          userEnvironmentPresenceId: userEnvironmentPresence.id,
        })
        .returning();

      return {
        userEnvironmentPresence,
        plotPoint,
        plotPointEnvironmentPresence,
      };
    });
  }

  public async seed() {
    await this.clear();

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
        location: universe.environment,
      }),
    ]);

    const o2o = await this.insertCompanionOneToOne();

    await Promise.all([
      this.insertUserEnvironmentPresence({
        user: g.user,
        environment: universe.environment,
      }),
      this.insertUserEnvironmentPresence({
        user: ivan.user,
        environment: o2o.environment,
      }),
      this.insertUserEnvironmentPresence({
        user: jake.user,
        environment: o2o.environment,
      }),
    ]);

    await this.insertAiMessage({
      user: g.user,
      environment: universe.environment,
      message: {
        content: "Standby for G stuff",
      },
    });

    await this.insertAiMessage({
      user: ivan.user,
      environment: o2o.environment,
      message: {
        content: "Welcome back friend. Let's get you authenticated",
      },
    });
  }
}
