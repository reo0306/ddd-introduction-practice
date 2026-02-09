import { BookId } from "../../Book/BookId/BookId";
import { Comment } from "../Comment/Comment";
import { Name } from "../Name/Name";
import { Rating } from "../Rating/Rating";
import { Review } from "../Review";
import { ReviewId } from "../ReviewId/ReviewId";
import { ReviewIdentity } from "../ReviewIdentity/ReviewIdentity";
import { BookRecommendationDomainService } from "./BookRecommendationDomainService";

describe("BookRecommendationDomainService", () => {
    let service: BookRecommendationDomainService;

    beforeEach(() => {
        service = new BookRecommendationDomainService();
    });

    const createSampleReview = (
        reviewId: string,
        bookId: string,
        name: string,
        rating: number,
        comment?: string
    ): Review => {
        return Review.create(
            new ReviewIdentity(new ReviewId(reviewId)),
            new BookId(bookId),
            new Name(name),
            new Rating(rating),
            comment ? new Comment(comment) : undefined
        );
    };

    describe("calculateTopRecommendedBooks", () => {
        test("信頼できるレビューから推薦書籍を正しく抽出してカウントする", () => {
            const review1 = createSampleReview(
                "rev1",
                "9784798126708",
                "Alice",
                5,
                "I loved this book! recommended books: Book A, Book B"
            );
            const review2 = createSampleReview(
                "rev2",
                "9784798126708",
                "Bob",
                4,
                "Great read. recommended books: Book B, Book C"
            );
            const review3 = createSampleReview(
                "rev3",
                "9784798126708",
                "Charlie",
                2,
                "Not my type."
            );
            const review4 = createSampleReview(
                "rev4",
                "9784798126708",
                "David",
                5,
                "Fantastic! recommended books: Book A, Book C, Book D"
            );

            const allReviews = [review1, review2, review3, review4];

            const recommendations = service.calculateTopRecommendedBooks(allReviews, 2);

            expect(recommendations).toEqual([
                "Book A, Book B",
                "Book B, Book C",
            ]);
        });

        test("信頼できるレビューがない場合、空の配列を返す", () => {
            const review1 = createSampleReview(
                "rev1",
                "9784798126708",
                "Alice",
                2,
                "I didn't like this book."
            );
            const review2 = createSampleReview(
                "rev2",
                "9784798126708",
                "Bob",
                3
            );

            const allReviews = [review1, review2];

            const recommendations = service.calculateTopRecommendedBooks(allReviews, 3);

            expect(recommendations).toEqual([]);
        });

        test("レビューが存在しない場合、空の配列を返す", () => {
            const allReviews: Review[] = [];

            const recommendations = service.calculateTopRecommendedBooks(allReviews, 3);

            expect(recommendations).toEqual([]);
        });
    });
});