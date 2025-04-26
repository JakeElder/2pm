import { CoreDBService } from "./core/core.service";
import { LibraryDBService } from "./library/library.service";

export type DBService = {
  core: CoreDBService;
  library: LibraryDBService;
};

export { CoreDBService, LibraryDBService };
