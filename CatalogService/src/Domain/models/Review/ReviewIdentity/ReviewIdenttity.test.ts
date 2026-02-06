import { ReviewId } from "../ReviewId/ReviewId";
import { ReviewIdentity } from "./ReviewIdenttity";

describe("ReviewIdentity", () => {
    it("同じIDを持つエンティティは等価である", () => {
        const id = new ReviewId();
        const identity1 = new ReviewIdentity(id);
        const identity2 = new ReviewIdentity(id);

        expect(identity1.equals(identity2)).toBeTruthy();
    });

    it("異なるIDを持つエンティティは等価でない", () => {
        const id1 = new ReviewId();
        const id2 = new ReviewId();
        const identity1 = new ReviewIdentity(id1);
        const identity2 = new ReviewIdentity(id2);

        expect(identity1.equals(identity2)).toBeFalsy();
    });
});