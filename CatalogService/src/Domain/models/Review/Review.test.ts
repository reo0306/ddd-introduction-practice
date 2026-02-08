import { BookId } from "../Book/BookId/BookId";
import { Comment } from "./Comment/Comment";
import { Name } from "./Name/Name";
import { Rating } from "./Rating/Rating";
import { Review } from "./Review";
import { ReviewId } from "./ReviewId/ReviewId";
import { ReviewIdentity } from "./ReviewIdentity/ReviewIdentity";

describe("Review", () => {
    const reviewId = new ReviewId();
    const reviewIdentity = new ReviewIdentity(reviewId);
    const bookId = new BookId("9784798126708");
    const name = new Name("山田太郎");
    const rating = new Rating(4);
    const comment = new Comment("This is a great book! Recommended books: Book A, Book B");

    describe("create", () => {
        it("レビューを作成できる", () => {
            const review = Review.create(reviewIdentity, bookId, name, rating, comment);

            expect(review.reviewId.equals(reviewId)).toBeTruthy();
            expect(review.bookId.equals(bookId)).toBeTruthy();
            expect(review.name.equals(name)).toBeTruthy();
            expect(review.rating.equals(rating)).toBeTruthy();
            expect(review.comment?.equals(comment)).toBeTruthy();
        });
    });

    describe("reconstruct", () => {
        it("レビューを再構築できる", () => {
            const review = Review.reconstruct(reviewIdentity, bookId, name, rating, comment);

            expect(review.reviewId.equals(reviewId)).toBeTruthy();
            expect(review.bookId.equals(bookId)).toBeTruthy();
            expect(review.name.equals(name)).toBeTruthy();
            expect(review.rating.equals(rating)).toBeTruthy();
            expect(review.comment?.equals(comment)).toBeTruthy();
        });
    });

    describe("equals", () => {
        it("同じIDを持つレビューは等価である", () => {
            const review1 = Review.create(reviewIdentity, bookId, name, rating, comment);
            const review2 = Review.create(reviewIdentity, bookId, name, rating, comment);

            expect(review1.equals(review2)).toBeTruthy();
        });
        
        it("異なるIDを持つレビューは等価でない", () => {
            const newReviewId = new ReviewId();
            const newReviewIdentity = new ReviewIdentity(newReviewId);
            const review1 = Review.create(reviewIdentity, bookId, name, rating, comment);
            const review2 = Review.create(newReviewIdentity, bookId, name, rating, comment);

            expect(review1.equals(review2)).toBeFalsy();
        });
    });

    describe("isTrustworthy", () => {
        it("コメントなしで信頼できるレビューを判定できる", () => {
            const trustworthyReview = Review.create(reviewIdentity, bookId, name, new Rating(5));
            const untrustworthyReview = Review.create(reviewIdentity, bookId, name, new Rating(2));

            expect(trustworthyReview.isTrustworthy()).toBeTruthy();
            expect(untrustworthyReview.isTrustworthy()).toBeFalsy();
        });

        it("コメントありで信頼できるレビューを判定できる", () => {
            const trustworthyComment = new Comment("Excellent read! Highly recommended.");
            const untrustworthyComment = new Comment("Bad book. Waste of time.");

            const trustworthyReview = Review.create(reviewIdentity, bookId, name, new Rating(4), trustworthyComment);
            const untrustworthyReview = Review.create(reviewIdentity, bookId, name, new Rating(2), untrustworthyComment);

            expect(trustworthyReview.isTrustworthy()).toBeTruthy();
            expect(untrustworthyReview.isTrustworthy()).toBeFalsy();
        });
    });

    describe("extractRecommendedBooks", () => {
        it("コメントがない場合は殻の配列を返す", () => {
            const review = Review.create(
                reviewIdentity,
                bookId,
                name,
                rating
            );

            const result = review.extractRecommendedBooks();
            expect(result).toEqual([]);
        });

        it("コメントからパターンに一致する複数の推薦本を抽出できる", () => {
            const reviewWithMultipleBooks = new Comment("Recommended books: Book A, Book B. I also liked other stuff.");

            const review = Review.create(
                reviewIdentity,
                bookId,
                name,
                rating,
                reviewWithMultipleBooks
            );

            const result = review.extractRecommendedBooks();
            expect(result).toEqual(["Book A, Book B"]);
        });

        it("重複する本は一度だけカウントされる", () => {
            const commnetWithDuplicates = new Comment("Recommended books: Book A, Book B, Book A, Book C, Book B");
            const review = Review.create(reviewIdentity, bookId, name, rating, commnetWithDuplicates);

            const result = review.extractRecommendedBooks();
            expect(result).toEqual([
                "Book A, Book B, Book A, Book C, Book B"
            ]);
        });
    });

    describe("updateName", () => {
        it("名前を更新できる", () => {
            const review = Review.create(reviewIdentity, bookId, name, rating, comment);

            const newName = new Name("佐藤花子");

            review.updateName(newName);

            expect(review.name.equals(newName)).toBeTruthy();
        });
    });

    describe("updateRating", () => {
        it("評価を変更できる", () => {
            const review = Review.create(reviewIdentity, bookId, name, rating, comment);
            const newRating = new Rating(5);

            review.updateRating(newRating);

            expect(review.rating.equals(newRating)).toBeTruthy();
        });
    });

    describe("editComment", () => {
        it("コメントを編集できる", () => {
            const review = Review.create(reviewIdentity, bookId, name, rating, comment);

            const newComment = new Comment("Edited comment content.");

            review.editComment(newComment);

            expect(review.comment?.equals(newComment)).toBeTruthy();
        });
    });
});