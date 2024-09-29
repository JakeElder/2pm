import {
  Drizzle,
  InsertAiUserDto,
  InsertAiUserResponseDto,
  InsertAiUserRoomPresenceDto,
  InsertAiUserRoomPresenceResponseDto,
  InsertHumanUserDto,
  InsertHumanUserResponseDto,
  InsertMessageDto,
  InsertMessageResponseDto,
  InsertWorldRoomDto,
  InsertWorldRoomResponseDto,
} from "@2pm/schemas";
import {
  users,
  plotPoints,
  rooms,
  worldRooms,
  roomWorldRooms,
  userPlotPoints,
  plotPointMessages,
  messages,
  userRoomPresences,
  humanUsers,
  aiUsers,
  aiUserRoomPresences,
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
      rm(roomWorldRooms),
      rm(userPlotPoints),
      rm(plotPointMessages),
      rm(userRoomPresences),
      rm(aiUserRoomPresences),
      rm(aiUsers),
      rm(humanUsers),
    ]);

    await Promise.all([
      rm(messages),
      rm(users),
      rm(plotPoints),
      rm(rooms),
      rm(worldRooms),
    ]);
  }

  public async insertWorldRoom(
    values: InsertWorldRoomDto,
  ): Promise<InsertWorldRoomResponseDto> {
    const { transaction } = this.drizzle;

    return transaction(async (tx) => {
      const [room] = await tx
        .insert(rooms)
        .values({ ...values.room, type: "WORLD" })
        .returning();

      const [worldRoom] = await tx
        .insert(worldRooms)
        .values(values.worldRoom)
        .returning();

      const [roomWorldRoom] = await tx
        .insert(roomWorldRooms)
        .values({ roomId: room.id, worldRoomId: worldRoom.id })
        .returning();

      return { room, worldRoom, roomWorldRoom };
    });
  }

  public async insertHumanUser(
    values: InsertHumanUserDto,
  ): Promise<InsertHumanUserResponseDto> {
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
          locationRoomId: values.location.id,
        })
        .returning();

      return { user, humanUser };
    });
  }

  public async insertAiUser(
    values: InsertAiUserDto,
  ): Promise<InsertAiUserResponseDto> {
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
    values: InsertMessageDto,
  ): Promise<InsertMessageResponseDto> {
    const { transaction } = this.drizzle;

    return transaction(async (tx) => {
      const [plotPoint] = await tx
        .insert(plotPoints)
        .values({ ...values.plotPoint, type: "MESSAGE" })
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

  public async insertAiUserRoomPresence(
    values: InsertAiUserRoomPresenceDto,
  ): Promise<InsertAiUserRoomPresenceResponseDto> {
    const [aiUserRoomPresence] = await this.drizzle
      .insert(aiUserRoomPresences)
      .values({ userId: values.user.id, roomId: values.room.id })
      .returning();
    return { aiUserRoomPresence };
  }

  public async seed() {
    await this.nuke();

    const universe = await this.insertWorldRoom({
      room: { id: 1 },
      worldRoom: { id: 1, code: "UNIVERSE" },
    });

    const g = await this.insertAiUser({
      user: { id: 1, tag: "g" },
      aiUser: { code: "G" },
    });

    const ivan = await this.insertAiUser({
      user: { id: 2, tag: "ivan" },
      aiUser: { code: "G" },
    });

    await this.insertHumanUser({
      user: { id: 3, tag: "jake" },
      location: { id: universe.room.id },
    });

    await this.insertAiUserRoomPresence({
      user: g.user,
      room: universe.room,
    });

    await this.insertMessage({
      plotPoint: { id: 1 },
      user: g.user,
      message: {
        id: 1,
        content: "Standby for G stuff",
        userId: g.user.id,
        roomId: universe.room.id,
      },
    });
  }
}
