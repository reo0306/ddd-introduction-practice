import { isEqual } from "lodash";

export class Rating {
    private readonly _value: number;

    static readonly MAX = 5;
    static readonly MIN = 1;

    constructor(value: number) {
        this.validaete(value);
        this._value = value;
    }

    private validaete(value: number): void {
        if (!Number.isInteger(value)) {
            throw new Error("評価は整数値でなければなりません.");
        }

        if (value < Rating.MIN || value > Rating.MAX) {
            throw new Error(`評価は${Rating.MIN}から${Rating.MAX}の数値でなければなりません.`);
        }
    }

    equals(other: Rating): boolean {
        return isEqual(this._value, other._value);
    }

    get value(): number {
        return this._value;
    }

    getQualityFactor(): number {
        return (this._value - Rating.MIN) / (Rating.MAX - Rating.MIN);
    }
}