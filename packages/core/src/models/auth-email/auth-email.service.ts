import { DBServiceModule } from "../../db/db-service-module";
import { authEmails } from "../../db/schema";
import { CreateAuthEmailDto, AuthEmailDto } from "./auth-email.dto";

export default class AuthEmails extends DBServiceModule {
  public async insert(dto: CreateAuthEmailDto): Promise<AuthEmailDto> {
    const [authEmail] = await this.drizzle
      .insert(authEmails)
      .values(dto)
      .returning();
    return authEmail;
  }
}
