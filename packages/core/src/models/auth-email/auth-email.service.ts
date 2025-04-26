import { CoreDBServiceModule } from "../../db/core/core-db-service-module";
import { authEmails } from "../../db/core/core.schema";
import { CreateAuthEmailDto, AuthEmailDto } from "./auth-email.dto";

export default class AuthEmails extends CoreDBServiceModule {
  public async insert(dto: CreateAuthEmailDto): Promise<AuthEmailDto> {
    const [authEmail] = await this.drizzle
      .insert(authEmails)
      .values(dto)
      .returning();
    return authEmail;
  }
}
