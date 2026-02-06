import { Author } from "../Author/Author";
import { BookId } from "../BookId/BookId";
import { Title } from "../Title/Title";
import { BookIdentity } from "./BookIdentity";

describe("BookIdentity", () => {
    it("同じIDを持つエンティティは等価である", () => {
        const id = new BookId('9784167158057');
        const identity1 = new BookIdentity(id, new Title('テストタイトル'), new Author('テスト著者'));
        const identity2 = new BookIdentity(id, new Title('別のタイトル'), new Author('別の著者'));
        
        expect(identity1.equals(identity2)).toBeTruthy();
    });

    it("異なるIDを持つエンティティは等価でない", () => {
        const id1 = new BookId('9784167158057');
        const id2 = new BookId('4167158051');
        const identity1 = new BookIdentity(id1, new Title('テストタイトル'), new Author('テスト著者'));
        const identity2 = new BookIdentity(id2, new Title('テストタイトル'), new Author('テスト著者'));
        
        expect(identity1.equals(identity2)).toBeFalsy();
    });
});