import { eq, asc } from "drizzle-orm";
import { DBServiceModule } from "../../db/db-service-module";
import {
  humanUserRoomEnvironments,
  humanUsers,
  users,
} from "../../db/app.schema";
import { UserSpaceListDto } from "./user-space-list.dto";
import { pipe, groupBy, mapValues, values, map, prop } from "remeda";
import HumanUsers from "../human-user/human-user.service";

export default class UserSpaceLists extends DBServiceModule {
  public async find(): Promise<UserSpaceListDto> {
    const userSpaces = await this.app.drizzle
      .select({
        humanUser: humanUsers,
        space: humanUserRoomEnvironments,
      })
      .from(humanUsers)
      .innerJoin(users, eq(users.id, humanUsers.userId))
      .innerJoin(
        humanUserRoomEnvironments,
        eq(humanUserRoomEnvironments.userId, users.id),
      )
      .orderBy(asc(humanUserRoomEnvironments.order));

    return pipe(
      userSpaces,
      groupBy((item) => item.humanUser.id),
      mapValues((group) => ({
        humanUser: HumanUsers.discriminate(group[0].humanUser),
        spaces: map(group, prop("space")),
      })),
      values(),
    );
  }
}
