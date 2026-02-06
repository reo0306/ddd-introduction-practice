import { Name } from "./Name";

describe('Name', () => {
    it('Nameが1文字で作成できる', () => {
        expect(new Name('A').value).toBe('A');
    });

    it('Nameが50文字で作成できる', () => {
        const longName = 'A'.repeat(50);
        expect(new Name(longName).value).toBe(longName);
    });

    it('最小長未満の値でNameを生成するとエラーになる', () => {
        expect(() => new Name("")).toThrow(`投稿者名は1文字以上、50文字以下でなければなりません。`);
    });

    it('最大長超過の値でNameを生成するとエラーになる', () => {
        const longName = 'A'.repeat(51);
        expect(() => new Name(longName)).toThrow(`投稿者名は1文字以上、50文字以下でなければなりません。`);
    });
});