import { DBServiceModule } from "../../db/db-service-module";
import { BibleVerseDto } from "./bible-verse.dto";
import { kjvVerses } from "../../db/library.schema";

export default class BibleVerses extends DBServiceModule {
  async findAll(): Promise<BibleVerseDto[]> {
    const res = await this.library.drizzle.select().from(kjvVerses).limit(20);
    return res;
  }
}
