import { MockTransactionManager } from "Application/shared/MockTransactionManager";
import { Author } from "Domain/models/Book/Author/Author";
import { Book } from "Domain/models/Book/Book";
import { BookId } from "Domain/models/Book/BookId/BookId";
import { BookIdentity } from "Domain/models/Book/BookIdentity/BookIdentity";
import { Price } from "Domain/models/Book/Price/Price";
import { Title } from "Domain/models/Book/Title/Title";
import { InMemoryBookRepository } from "infrastructure/InMemory/Book/InMemoryBookRepository";

import { RegisterBookDTO } from "./RegisterBookDTO";
import {
    RegisterBookCommand,
    RegisterBookService,
} from "./RegisterBookService";

describe("RegisterBookService", () => {
    let repository: InMemoryBookRepository;
    let registerBookService: RegisterBookService;

    beforeEach(async () => {
        repository = new InMemoryBookRepository();
        registerBookService = new RegisterBookService(repository, new MockTransactionManager());
    });

    it("should register a new book", async () => {
        const command: Required<RegisterBookCommand> = {
            isbn: "9784798126708",
            title: "JavaScript本格入門",
            author: "山田 祥寛",
            price: 3480,
        };
        
        const result = await registerBookService.execute(command);

        expect(result).toEqual<RegisterBookDTO>({
            id: command.isbn,
            title: command.title,
            author: command.author,
            price: {
                amount: command.price,
                currency: 'JPY',
            },
        });

        const createdBook = await repository.findById(new BookId(command.isbn));
        expect(createdBook).not.toBeNull();
    });

    it("should not register a book with duplicate ISBN", async () => {
        const bookId = new BookId("9784798126708");
        const title = new Title("JavaScript本格入門");
        const author = new Author("山田 祥寛");
        const price = new Price({ amount: 3480, currency: 'JPY' });
        const bookIdentity = new BookIdentity(bookId, title, author);
        const book = Book.create(bookIdentity, price);
        await repository.save(book);

        const command: Required<RegisterBookCommand> = {
            isbn: "9784798126708",
            title: "JavaScript本格入門",
            author: "山田 祥寛",
            price: 3480,
        };

        await expect(registerBookService.execute(command)).rejects.toThrow();
    });
});