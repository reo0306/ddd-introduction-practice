import { MockTransactionManager } from "Application/shared/MockTransactionManager";
import { BookId } from "Domain/models/Book/BookId/BookId";
import { Comment } from "Domain/models/Review/Comment/Comment";
import { Name } from "Domain/models/Review/Name/Name";
import { Rating } from "Domain/models/Review/Rating/Rating";
import { Review } from "Domain/models/Review/Review";
import { ReviewId } from "Domain/models/Review/ReviewId/ReviewId";
import { ReviewIdentity } from "Domain/models/Review/ReviewIdentity/ReviewIdentity";
import { InMemoryReviewRepository } from "infrastructure/InMemory/Review/InMemoryReviewRepository";

import { EditReviewDTO } from "./EdiReviewDTO";
import {
    EditReviewCommand,
    EditReviewService,
} from "./EditReviewService";

describe("EditReviewService", () => {
    let reviewRepository: InMemoryReviewRepository;
    let editReviewService: EditReviewService;

    beforeEach(() => {
        reviewRepository = new InMemoryReviewRepository();
        editReviewService = new EditReviewService(reviewRepository, new MockTransactionManager());
    });

    it("should edit an existing review", async () => {
        const reviewId = "review-1";
        const bookId = "9784798126708";

        const review = Review.create(
            new ReviewIdentity(new ReviewId(reviewId)),
            new BookId(bookId),
            new Name("レビュワー1"),
            new Rating(5),
            new Comment("素晴らしい本でした！")
        );
        
        await reviewRepository.save(review);

        const command: EditReviewCommand = {
            reviewId,
            name: "レビュワー1-編集",
            rating: 4,
            comment: "素晴らしい本でした！ - 編集",
        };
        
        const result = await editReviewService.execute(command);

        expect(result).toEqual<EditReviewDTO>({
            id: reviewId,
            bookId,
            name: "レビュワー1-編集",
            rating: 4,
            comment: "素晴らしい本でした！ - 編集",
        });

        const updatedReview = await reviewRepository.findById(new ReviewId(reviewId));
        expect(updatedReview).not.toBeNull();
        expect(updatedReview?.name.value).toBe("レビュワー1-編集");
        expect(updatedReview?.rating.value).toBe(4)
        expect(updatedReview?.comment?.value).toBe("素晴らしい本でした！ - 編集");
    });

    it("should throw an error if the review does not exist", async () => {
        const command: EditReviewCommand = {
            reviewId: "non-existent-review",
            name: "レビュワー1-編集",
        };

        await expect(editReviewService.execute(command)).rejects.toThrow(
            `Review with ID ${command.reviewId} not found.`
        );
    });
});