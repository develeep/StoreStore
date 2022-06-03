import { model } from 'mongoose';
import { ReviewSchema } from '../schemas/review-schema';

const Review = model('reviews', ReviewSchema);

export class ReviewModel {
	async findByName(name) {
		const reviews = await Review.find({ author: name });
		return reviews;
	}

	async findByIds(objectIdList) {
		const reviews = await Review.find({
			$or: objectIdList,
		}).sort({ createdAt: -1 });
		return reviews;
	}

	async findById(objectId) {
		const review = await Review.findOne({ _id: objectId });
		return review;
	}

	async create(reviewInfo) {
		const createdNewReview = await Review.create(reviewInfo);
		return createdNewReview;
	}

	async findAll() {
		const reviews = await Review.find({});
		return reviews;
	}

	async update({ objectId, update }) {
		const filter = { _id: objectId };
		const option = { returnOriginal: false };

		const updatedReview = await Review.findOneAndUpdate(filter, update, option);
		return updatedReview;
	}
	async delete(objectId) {
		await Review.deleteOne({ _id: objectId });
		return;
	}
	// 한 사용자가 작성한 모든 댓글 삭제(유저 삭제 시?)
	async deleteByAuthor(author) {
		await Review.deleteMany({ author });
		return;
	}
}

const reviewModel = new ReviewModel();

export { reviewModel };
