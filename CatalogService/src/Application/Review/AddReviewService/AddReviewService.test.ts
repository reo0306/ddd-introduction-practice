import { MockTransactionManager } from "Application/shared/MockTransactionManager";
import { Author } from "Domain/models/Book/Author/Author";
import { Book } from "Domain/models/Book/Book";
import { BookId } from "Domain/models/Book/BookId/BookId";
import { BookIdentity } from "Domain/models/Book/BookIdentity/BookIdentity";
import { Price } from "Domain/models/Book/Price/Price";
import { Title } from "Domain/models/Book/Title/Title";
import { ReviewId } from "Domain/models/Review/ReviewId/ReviewId";
import { InMemoryBookRepository } from "infrastructure/InMemory/Book/InMemoryBookRepository";
import { InMemoryReviewRepository } from "infrastructure/InMemory/Review/InMemoryReviewRepository";

import { AddReviewDTO } from "./AddReviewDTO";
import {
    AddReviewCommand,
    AddReviewService,
} from "./AddReviewService";

describe("AddReviewService", () => {
    let bookRepository: InMemoryBookRepository;
    let reviewRepository: InMemoryReviewRepository;
    let addReviewService: AddReviewService;

    beforeEach(async () => {
        bookRepository = new InMemoryBookRepository();
        reviewRepository = new InMemoryReviewRepository();
        addReviewService = new AddReviewService(reviewRepository, bookRepository, new MockTransactionManager());
    });

    it("should add a review for an existing book", async () => {
        const bookId = "9784798126708";
        const book = Book.create(
            new BookIdentity(
                new BookId(bookId),
                new Title("JavaScript本格入門"),
                new Author("山田 祥寛")
            ),
            new Price({ amount: 3480, currency: 'JPY' })
        );

        await bookRepository.save(book);

        const command: Required<AddReviewCommand> = {
            bookId,
            name: "レビュワー1",
            rating: 5,
            comment: "素晴らしい本でした！",
        };

        const result = await addReviewService.execute(command);

        expect(result).toEqual<AddReviewDTO>({
            id: expect.any(String),
            bookId,
            name: command.name,
            rating: command.rating,
            comment: command.comment,
        });

        const savedReview = await reviewRepository.findById(new ReviewId(result.id));
        expect(savedReview).not.toBeNull();
    });

    it("should not add a review for a non-existent book", async () => {
        const command: Required<AddReviewCommand> = {
            bookId: "9784798126709",
            name: "レビュワー2",
            rating: 4,
            comment: "良い本でした。",
        };

        await expect(addReviewService.execute(command)).rejects.toThrow(
            `Book with ID ${command.bookId} not found.`
        );
    });
});