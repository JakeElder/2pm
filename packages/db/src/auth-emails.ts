import { authEmails } from "@2pm/data/schema";
import { DBService } from "./db-module";
import { CreateAuthEmailDto, AuthEmailDto } from "@2pm/data";

export default class AuthEmails extends DBService {
  public async insert(dto: CreateAuthEmailDto): Promise<AuthEmailDto> {
    const [authEmail] = await this.drizzle
      .insert(authEmails)
      .values(dto)
      .returning();
    return authEmail;
  }
}
