import { BookId } from "../../../Domain/models/Book/BookId/BookId";
import { Comment } from "../../..//Domain/models/Review/Comment/Comment";
import { IReviewRepository } from "../../../Domain/models/Review/IReviewRepository";
import { Name } from "../../..//Domain/models/Review/Name/Name";
import { Rating } from "../../..//Domain/models/Review/Rating/Rating";
import { Review } from "../../..//Domain/models/Review/Review";
import { ReviewId } from "../../..//Domain/models/Review/ReviewId/ReviewId";
import { ReviewIdentity } from "../../..//Domain/models/Review/ReviewIdentity/ReviewIdentity";

import pool from "../db";

export class SQLReviewRepository implements IReviewRepository {
    private toDomain(row: any): Review {
        const commnet = row.comment ? new Comment(row.comment) : undefined;

        return Review.reconstruct(
            new ReviewIdentity(new ReviewId(row.review_id)),
            new BookId(row.book_id),
            new Name(row.reviewer_name),
            new Rating(row.rating),
            commnet
        );
    }

    async save(review: Review): Promise<void> {
        const client = await pool.connect();
        try {
            const query = `
                INSERT INTO "Review"(
                  "review_id",
                  "book_id",
                  "name",
                  "rating",
                  "comment"
                ) VALUES ($1, $2, $3, $4, $5)
            `;
            const values = [
                review.reviewId.value,
                review.bookId.value,
                review.name.value,
                review.rating.value,
                review.comment?.value,
            ];

            await client.query(query, values);
        } finally {
            client.release();
        }
    }
    
    async update(review: Review): Promise<void> {
        const client = await pool.connect();
        try {
            const query = `
                UPDATE "Review"
                SET "book_id" = $2,
                    "name" = $3,
                    "rating" = $4,
                    "comment" = $5
                WHERE "review_id" = $1
            `;
            const values = [
                review.reviewId.value,
                review.bookId.value,
                review.name.value,
                review.rating.value,
                review.comment?.value,
            ];

            const result = await client.query(query, values);
            if (result.rowCount === 0) {
                throw new Error(`Review with ID ${review.reviewId.value} not found.`);
            }
        } finally {
            client.release();
        }
    }
    
    async delete(reviewId: ReviewId): Promise<void> {
        const client = await pool.connect();
        try {
            const query = `
                DELETE FROM "Review"
                WHERE "review_id" = $1
            `;
            const values = [reviewId.value];

            await client.query(query, values);
        } finally {
            client.release();
        }
    }
    
    async findById(reviewId: ReviewId): Promise<Review | null> {
        const client = await pool.connect();
        try {
            const query = `
                SELECT * FROM "Review"
                WHERE "review_id" = $1
            `;
            const values = [reviewId.value];

            const result = await client.query(query, values);
            if (result.rows.length === 0) {
                return null;
            }

            return this.toDomain(result.rows[0]);
        } finally {
            client.release();
        }
    }
    
    async findAllByBookId(bookId: BookId): Promise<Review[]> {
        const client = await pool.connect();
        try {
            const query = `
                SELECT * FROM "Review"
                WHERE "book_id" = $1
            `;
            const values = [bookId.value];

            const result = await client.query(query, values);

            return result.rows.map((row) => this.toDomain(row));

        } finally {
            client.release();
        }
    }
}