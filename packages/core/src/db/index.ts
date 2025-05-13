import { AppDBService } from "./app/app.service";
import { LibraryDBService } from "./library/library.service";

export type DBService = {
  app: AppDBService;
  library: LibraryDBService;
};

export { AppDBService, LibraryDBService };
