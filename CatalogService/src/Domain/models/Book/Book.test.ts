import { Author } from "./Author/Author";
import { BookId } from "./BookId/BookId";
import { BookIdentity } from "./BookIdentity/BookIdentity";
import { Book } from "./Book";
import { Title } from "./Title/Title";
import { Price } from "./Price/Price";

describe("Book", () => {
    const bookId = new BookId('9784167158057');
    const title = new Title('テストタイトル');
    const author = new Author('テスト著者');
    const price = new Price({ amount: 1500, currency: 'JPY' });
    const newPrice = new Price({ amount: 2000, currency: 'JPY' });
    const bookIdentity = new BookIdentity(bookId, title, author);

    describe("create", () => {
        it("本を作成できる", () => {
            const book = Book.create(bookIdentity, price);

            expect(book.bookId).toBe(bookId);
            expect(book.title).toBe(title);
            expect(book.author).toBe(author);
            expect(book.price).toBe(price);
        });
    });

    describe("reconstruct", () => {
        it("本を再構築できる", () => {
            const book = Book.reconstruct(bookIdentity, price);

            expect(book.bookId).toBe(bookId);
            expect(book.title).toBe(title);
            expect(book.author).toBe(author);
            expect(book.price).toBe(price);
        });
    });

    describe("equals", () => {
        it("同じIDを持つ本は等価である", () => {
            const book1 = Book.create(bookIdentity, price);
            const book2 = Book.create(bookIdentity, price);

            expect(book1.equals(book2)).toBeTruthy();
        });
        
        it("異なるIDを持つ本は等価でない", () => {
            const book1 = Book.create(bookIdentity, price);
            const newBookId = new BookId('9784167158058');
            const newBookIdentity = new BookIdentity(newBookId, title, author);
            const book2 = Book.create(newBookIdentity, price);

            expect(book1.equals(book2)).toBeFalsy();
        });
    });

    describe("changePrice", () => {
        it("本の価格を変更できる", () => {
            const book = Book.create(bookIdentity, price);

            expect(book.price).toBe(price);

            book.changePrice(newPrice);

            expect(book.price).toBe(newPrice);
        });
    });
});