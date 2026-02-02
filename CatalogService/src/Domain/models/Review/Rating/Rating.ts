import { ValueObject } from "Domain/models/shared/ValueObject";

type RatingValue = number;
export class Rating extends ValueObject<RatingValue, Rating> {
    static readonly MAX = 5;
    static readonly MIN = 1;

    constructor(value: RatingValue) {
        super(value);
    }

    protected validate(value: RatingValue): void {
        if (!Number.isInteger(value)) {
            throw new Error("評価は整数値でなければなりません.");
        }

        if (value < Rating.MIN || value > Rating.MAX) {
            throw new Error(`評価は${Rating.MIN}から${Rating.MAX}の数値でなければなりません.`);
        }
    }

    getQualityFactor(): number {
        return (this._value - Rating.MIN) / (Rating.MAX - Rating.MIN);
    }
}