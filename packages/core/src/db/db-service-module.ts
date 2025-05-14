import { AppDBContext, DBContexts, LibraryDBContext } from "./db.types";

export abstract class DBServiceModule {
  protected app: AppDBContext;
  protected library: LibraryDBContext;

  constructor({ app, library }: DBContexts) {
    this.app = app;
    this.library = library;
  }
}
