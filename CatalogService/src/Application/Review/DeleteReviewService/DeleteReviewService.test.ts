import { container } from "tsyringe";
import { BookId } from "Domain/models/Book/BookId/BookId";
import { Comment } from "Domain/models/Review/Comment/Comment";
import { Name } from "Domain/models/Review/Name/Name";
import { Rating } from "Domain/models/Review/Rating/Rating";
import { Review } from "Domain/models/Review/Review";
import { ReviewId } from "Domain/models/Review/ReviewId/ReviewId";
import { ReviewIdentity } from "Domain/models/Review/ReviewIdentity/ReviewIdentity";
import { InMemoryReviewRepository } from "infrastructure/InMemory/Review/InMemoryReviewRepository";

import {
    DeleteReviewCommand,
    DeleteReviewService,
} from "./DeleteReviewService";

describe("DeleteReviewService", () => {
    let reviewRepository: InMemoryReviewRepository;
    let deleteReviewService: DeleteReviewService;

    beforeEach(() => {
        deleteReviewService = container.resolve(DeleteReviewService);
        reviewRepository = deleteReviewService["reviewRepository"] as InMemoryReviewRepository;
    });

    it("should delete an existing review", async () => {
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

        let retrievedReview = await reviewRepository.findById(new ReviewId(reviewId));
        expect(retrievedReview).not.toBeNull();

        const command: DeleteReviewCommand = {
            reviewId,
        };

        await deleteReviewService.execute(command);

        retrievedReview = await reviewRepository.findById(new ReviewId(reviewId));
        expect(retrievedReview).toBeNull();
    });

    it("should throw an error if the review does not exist", async () => {
        const command: DeleteReviewCommand = {
            reviewId: "non-existent-review",
        };

        await expect(deleteReviewService.execute(command)).rejects.toThrow(
            `Review with ID ${command.reviewId} not found.`
        );
    });
});