import { ValueObject } from "../../shared/ValueObject";

type CommentValue = string;

export class Comment extends ValueObject<CommentValue, 'Comment'> {
    static readonly MAX_LENGTH = 1000;
    static readonly MIN_LENGTH = 1;

    constructor(value: CommentValue) {
        super(value);
    }

    protected validate(value: CommentValue): void {
        if (value.length < Comment.MIN_LENGTH || value.length > Comment.MAX_LENGTH) {
            throw new Error(`コメントの長さは${Comment.MIN_LENGTH}文字以上${Comment.MAX_LENGTH}文字以下でなければなりません。`);
        }
    }

    getQualityFactor(): number {
        const minLength = 10;
        const optimalLength = 100;

        const length = this._value.trim().length;

        if (length < minLength) {
            return 0.2;
        }

        if (length >= optimalLength) {
            return 1.0;
        }

        return 0.2 + 0.8 * ((length - minLength) / (optimalLength - minLength));
    }

    extractMatches(pattern: RegExp): string[] {
        const results: string[] = [];
        const text = this._value;

        const globalPattern = pattern.global ? pattern : new RegExp(pattern.source, pattern.flags + 'g');

        let match;
        while ((match = globalPattern.exec(text)) !== null) {
            if (match[1]) results.push(match[1]);
        }

        return results;
    }
}