import { ValueObject } from "Domain/models/shared/ValueObject";

type BookIdValue = string;
export class BookId extends ValueObject<BookIdValue, BookId> {
    static MAX_LENGTH = 13;
    static MIN_LENGTH = 10;

    constructor(value: BookIdValue) {
        super(value);
    }

    protected validate(isbn: BookIdValue): void {
        if (isbn.length < BookId.MIN_LENGTH || isbn.length > BookId.MAX_LENGTH) {
            throw new Error("ISBNの文字数が不正です");
        }

        if (!this.isValidIsbn10(isbn) && !this.isValidIsbn13(isbn)) {
            throw new Error("不正なISBNの形式です");
        }
    }
    
    private isValidIsbn10(isbn10: string): boolean {
        return isbn10.length === 10;
    }

    private isValidIsbn13(isbn13: string): boolean {
        return isbn13.startsWith('978') && isbn13.length === 13;
    }

    toISBN(): string {
        if (this._value.length === 10) {
            const groupIdentifiler = this._value.substring(0, 1);
            const publisherCode = this._value.substring(1, 3);
            const bookCode = this._value.substring(3, 9);
            const checkSum = this._value.substring(9);

            return `ISBN${groupIdentifiler}-${publisherCode}-${bookCode}-${checkSum}`;
        } else {
            const isbnPrefix = this._value.substring(0, 3);
            const groupIdentifiler = this._value.substring(3, 4);
            const publisherCode = this._value.substring(4, 6);
            const bookCode = this._value.substring(6, 12);
            const checkSum = this._value.substring(12);
            
            return `ISBN${isbnPrefix}-${groupIdentifiler}-${publisherCode}-${bookCode}-${checkSum}`;
        }
    }
}