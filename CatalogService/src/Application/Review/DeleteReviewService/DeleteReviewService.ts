import { inject, injectable } from "tsyringe"
import { ITransactionManager } from "Application/shared/ITransactionManager";
import { IReviewRepository } from "Domain/models/Review/IReviewRepository";
import { ReviewId } from "Domain/models/Review/ReviewId/ReviewId";

export type DeleteReviewCommand = {
    reviewId: string;
};

@injectable()
export class DeleteReviewService {
    constructor(
        @inject("IReviewRepository")
        private reviewRepository: IReviewRepository,
        @inject("ITransactionManager")
        private transactionManager: ITransactionManager
    ) {}

    async execute(command: DeleteReviewCommand): Promise<void> {
        return await this.transactionManager.begin(async () => {
            const reviewId = new ReviewId(command.reviewId);
            const review = await this.reviewRepository.findById(reviewId);

            if (!review) {
                throw new Error(`Review with ID ${command.reviewId} not found.`);
            }

            await this.reviewRepository.delete(reviewId);
        });
    }
}