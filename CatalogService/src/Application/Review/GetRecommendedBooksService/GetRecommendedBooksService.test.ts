import { BookId } from "../../../Domain/models/Book/BookId/BookId";
import { Comment } from "../../../Domain/models/Review/Comment/Comment";
import { Name } from "../../../Domain/models/Review/Name/Name";
import { Rating } from "../../../Domain/models/Review/Rating/Rating";
import { Review } from "../../../Domain/models/Review/Review";
import { ReviewId } from "../../../Domain/models/Review/ReviewId/ReviewId";
import { ReviewIdentity } from "Domain/models/Review/ReviewIdentity/ReviewIdentity";
import { InMemoryReviewRepository } from "infrastructure/InMemory/Review/InMemoryReviewRepository";

import { GetRecommendedBooksDTO } from "./GetRecommendedBooksDTO";
import {
    GetRecommendedBooksCommand,
    GetRecommendedBooksService,
} from "./GetRecommendedBooksService";

describe("GetRecommendedBooksService", () => {
    let reviewRepository: InMemoryReviewRepository;
    let getRecommendedBooksService: GetRecommendedBooksService;
    
    beforeEach(() => {
        reviewRepository = new InMemoryReviewRepository();
        getRecommendedBooksService = new GetRecommendedBooksService(reviewRepository);
    });

    it("should return recommended books based on reviews", async () => {
        const targetBookId = "9784814400737";

        const review1 = Review.create(
            new ReviewIdentity(new ReviewId("review-1")),
            new BookId(targetBookId),
            new Name("レビュワー1"),
            new Rating(5),
            new Comment("実践ドメイン駆動設計!")
        );
        const review2 = Review.create(
            new ReviewIdentity(new ReviewId("review-2")),
            new BookId(targetBookId),
            new Name("レビュワー2"),
            new Rating(4),
            new Comment("実践ドメイン駆動設計.")
        );
        const review3 = Review.create(
            new ReviewIdentity(new ReviewId("review-3")),
            new BookId(targetBookId),
            new Name("レビュワー3"),
            new Rating(5),
            new Comment("実践ドメイン駆動設計?")
        );

        await reviewRepository.save(review1);
        await reviewRepository.save(review2);
        await reviewRepository.save(review3);

        const command: GetRecommendedBooksCommand = {
            bookId: targetBookId,
            maxCount: 1,
        };

        const result = await getRecommendedBooksService.execute(command);

        expect(result).toEqual<GetRecommendedBooksDTO>({
            sourceBookId: command.bookId,
            recommendedBooks: ["実践ドメイン駆動設計"],
        });
    });

    it("should return empty recommended books if no reviews", async () => {
        const command: GetRecommendedBooksCommand = {
            bookId: "9784814400731",
        };

        const result = await getRecommendedBooksService.execute(command);
        
        expect(result).toEqual<GetRecommendedBooksDTO>({
            sourceBookId: command.bookId,
            recommendedBooks: [],
        });
    });
});