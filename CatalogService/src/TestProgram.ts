import { container } from "tsyringe";

import { MockTransactionManager } from "Application/shared/MockTransactionManager";
import { InMemoryBookRepository } from "infrastructure/InMemory/Book/InMemoryBookRepository";
import { InMemoryReviewRepository } from "infrastructure/InMemory/Review/InMemoryReviewRepository";

container.register("IBookRepository", { useClass: InMemoryBookRepository });
container.register("IReviewRepository", { useClass: InMemoryReviewRepository });
container.register("ITransactionManager", { useClass: MockTransactionManager });