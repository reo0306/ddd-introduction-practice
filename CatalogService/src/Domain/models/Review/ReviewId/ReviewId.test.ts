import { ReviewId } from "./ReviewId";

jest.mock("nanoid", () => ({
    nanoid: jest.fn(() => "tesIdWithExactLength"),
}));

describe("ReviewId", () => {
    test('デフォルト値でReviewIdを生成する', () => {
        const reviewId = new ReviewId();
        expect(reviewId.value).toBe('tesIdWithExactLength');
    });

    test('指定された値でReviewIdを生成する', () => {
        const value = 'customId';
        const reviewId = new ReviewId(value);
        expect(reviewId.value).toBe(value);
    });

    test('最小長の値でReviewIdを生成するとエラーになる', () => {
        const shortValue = "";
        expect(() => new ReviewId(shortValue)).toThrow('ReviewIDは1文字以上100文字以下でなければなりません。');
    });

    test('最大長の値でReviewIdを生成するとエラーになる', () => {
        const longValue = 'a'.repeat(101);
        expect(() => new ReviewId(longValue)).toThrow('ReviewIDは1文字以上100文字以下でなければなりません。');
    });
});