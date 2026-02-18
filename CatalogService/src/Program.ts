import { container } from "tsyringe";

import { SQLBookRepository } from "./infrastructure/SQL/Book/SQLBookRepository";
import { SQLReviewRepository } from "./infrastructure/SQL/Review/SQLReviewRepository";
import { SQLTransactionManager } from "./infrastructure/SQL/SQLTransactionManager";

container.register("IBookRepository", { useClass: SQLBookRepository });
container.register("IReviewRepository", { useClass: SQLReviewRepository });
container.register("ITransactionManager", { useClass: SQLTransactionManager });
