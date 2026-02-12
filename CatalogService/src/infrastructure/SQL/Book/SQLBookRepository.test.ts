import { Author } from "../../../Domain/models/Book/Author/Author";
import { Book } from "../../../Domain/models/Book/Book";
import { BookId } from "../../../Domain/models/Book/BookId/BookId";
import { BookIdentity } from "../../../Domain/models/Book/BookIdentity/BookIdentity";
import { Price } from "../../..//Domain/models/Book/Price/Price";
import { Title } from "../../../Domain/models/Book/Title/Title";

import pool from "../db";
import { SQLClientManager } from "../SQLClienttManager";
import { SQLBookRepository } from "./SQLBookRepository";

const clientManager = new SQLClientManager();
const repository = new SQLBookRepository(clientManager);

describe("SQLBookRepository", () => {
    beforeEach(async () => {
        await pool.query("BEGIN");
        await pool.query('DELETE FROM "Review"');
        await pool.query('DELETE FROM "Book"');
        await pool.query("COMMIT");
    });

    afterAll(async () => {
        await pool.end();
    });

    describe("save/findById", () => {
        test("should save and find a book", async () => {
            const bookId = new BookId("9784798126708");
            const title = new Title("JavaScript本格入門");
            const author = new Author("山田 祥寛");
            const price = new Price({ amount: 3480, currency: 'JPY' });

            const book = Book.reconstruct(
                new BookIdentity(bookId, title, author),
                price
            );
            
            await repository.save(book);

            const found = await repository.findById(bookId);

            expect(found).not.toBeNull();
            expect(found?.bookId.equals(bookId)).toBeTruthy();
            expect(found?.title.equals(title)).toBeTruthy();
            expect(found?.author.equals(author)).toBeTruthy();
            expect(found?.price.equals(price)).toBeTruthy();
        });

        test("should return null if book not found", async () => {
            const notExistenId = new BookId("9784798126709");
            const found = await repository.findById(notExistenId);
            expect(found).toBeNull();
        });
    });
});