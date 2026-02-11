import { Author } from "../../../Domain/models/Book/Author/Author";
import { Book } from "../../../Domain/models/Book/Book";
import { BookId } from "../../../Domain/models/Book/BookId/BookId";
import { BookIdentity } from "../../../Domain/models/Book/BookIdentity/BookIdentity";
import { IBookRepository } from "../../../Domain/models/Book/IBookRepository";
import { Price } from "../../..//Domain/models/Book/Price/Price";
import { Title } from "../../../Domain/models/Book/Title/Title";


import pool from "../db";

export class SQLBookRepository implements IBookRepository {
    private toDomain(row: any): Book {
        return Book.reconstruct(
            new BookIdentity(
                new BookId(row.book_id),
                new Title(row.title),
                new Author(row.author)
            ),
            new Price({
                amount: parseFloat(row.price_amount),
                currency: row.price_currency,
            })
        );
    }

    async save(book: Book): Promise<void> {
        const client = await pool.connect();
        try {
            const query = `
                INSERT INTO "Book"(
                  "book_id",
                  "title",
                  "author",
                  "price_amount",
                  "price_currency"
                ) VALUES ($1, $2, $3, $4, $5)
            `;
            const values = [
                book.bookId.value,
                book.title.value,
                book.author.value,
                book.price.amount,
                book.price.currency,
            ];

            await client.query(query, values);
        } finally {
            client.release();
        }
    }

    async findById(bookId: BookId): Promise<Book | null> {
        const client = await pool.connect();
        try {
            const query = `
                SELECT *
                FROM "Book"
                WHERE "book_id" = $1
            `;
            const values = [bookId.value];

            const result = await client.query(query, values);
            if (result.rows.length === 0) {
                return null;
            }

            return this.toDomain(result.rows[0]);
        } finally {
            client.release();
        }
    }
}