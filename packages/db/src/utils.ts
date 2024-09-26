import {
  Drizzle,
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
  userRoomPresence,
  humanUsers,
  aiUsers,
  aiUserRoomPresence,
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

    // Clear relations
    await rm(roomWorldRooms);
    await rm(userPlotPoints);
    await rm(plotPointMessages);
    await rm(userRoomPresence);
    await rm(aiUserRoomPresence);
    await rm(aiUsers);
    await rm(humanUsers);

    // Clear entities
    await rm(messages);
    await rm(users);
    await rm(plotPoints);
    await rm(rooms);
    await rm(worldRooms);
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
        .values({ userId: user.id, locationRoomId: values.location.id })
        .returning();

      return { user, humanUser };
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

  public async seed() {
    const { transaction } = this.drizzle;

    // Clear DB
    await this.nuke();

    // Insert UNIVERSE
    const { room: universe } = await this.insertWorldRoom({
      room: { id: 1 },
      worldRoom: { id: 1, code: "UNIVERSE" },
    });

    // Users
    const [g, jake] = await transaction(async (tx) => {
      const [g, jake] = await tx
        .insert(users)
        .values([
          { id: 1, tag: "g", type: "AI" },
          { id: 2, tag: "jake", type: "HUMAN" },
        ])
        .returning();

      await tx.insert(humanUsers).values({
        userId: jake.id,
        locationRoomId: universe.id,
      });

      await tx.insert(aiUsers).values({
        code: "G",
        userId: g.id,
      });

      await tx
        .insert(aiUserRoomPresence)
        .values([{ userId: g.id, roomId: universe.id }]);

      return [g, jake];
    });

    // Insert message
    await this.insertMessage({
      plotPoint: { id: 1 },
      user: g,
      message: {
        id: 1,
        content: "Standby for G stuff",
        userId: g.id,
        roomId: universe.id,
      },
    });
  }
}
