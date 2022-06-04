import { reviewModel } from '../db';

import mongoose from 'mongoose';

class ReviewService {
	// 본 파일의 맨 아래에서, new ReviewService(reviewModel) 하면, 이 함수의 인자로 전달됨
	constructor(reviewModel) {
		this.reviewModel = reviewModel;
	}

	async findById(objectId) {
		const review = await this.reviewModel.findById(objectId);
		return review;
	}

	// objectIdList로 리뷰들 찾기, 최신순으로 정렬
	async findByIds(objectIdList) {
		const reviews = await this.reviewModel.findByIds(objectIdList);
		return reviews;
	}

	// 리뷰 추가
	async addReview(reviewInfo) {
		// 객체 destructuring
		const { comment, author, starRate, productId } = reviewInfo;

		// db에 저장, author는 user objectId 여야 함.
		const createdNewReview = await this.reviewModel.create(reviewInfo);

		return createdNewReview;
	}

	// user objectId로 reivews 찾아서 반환
	async getReviewsByauthor(authorId) {
		const reivews = await this.reviewModel.findByName(authorId);
		return reivews;
	}

	// 전체 리뷰 찾기
	async getAllReviews() {
		const reviews = await this.reviewModel.findAll();
		return reviews;
	}

	async deleteReviewByReviewId(reviewId) {
		await this.reviewModel.delete(reviewId);
		return;
	}

	// 한 사용자가 작성한 모든 댓글 삭제(유저 삭제 시?)
	async deleteReviewByAuthor(authorId) {
		await this.reviewModel.deleteByAuthor(authorId);
		return;
	}

	// 리뷰 수정
	async setReview(reviewId, toUpdate) {
		// 업데이트 진행
		const review = await this.reviewModel.update({
			reviewId,
			update: toUpdate,
		});
		return review;
	}
}

const reviewService = new ReviewService(reviewModel);

export { reviewService };
