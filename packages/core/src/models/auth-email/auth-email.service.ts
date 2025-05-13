import { AppDBServiceModule } from "../../db/app/app-db-service-module";
import { authEmails } from "../../db/app/app.schema";
import { CreateAuthEmailDto, AuthEmailDto } from "./auth-email.dto";

export default class AuthEmails extends AppDBServiceModule {
  public async insert(dto: CreateAuthEmailDto): Promise<AuthEmailDto> {
    const [authEmail] = await this.drizzle
      .insert(authEmails)
      .values(dto)
      .returning();
    return authEmail;
  }
}
