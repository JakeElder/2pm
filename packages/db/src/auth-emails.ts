import { authEmails } from "@2pm/data/schema";
import { DbModule } from "./db-module";
import { CreateAuthEmailDto, AuthEmailDto } from "@2pm/data";

export default class AuthEmails extends DbModule {
  public async insert(dto: CreateAuthEmailDto): Promise<AuthEmailDto> {
    const [authEmail] = await this.drizzle
      .insert(authEmails)
      .values(dto)
      .returning();
    return authEmail;
  }
}
