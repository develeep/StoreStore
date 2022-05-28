import { orderedProductModel } from '../db';

import mongoose from 'mongoose';

class OrderedProductService {
	// 본 파일의 맨 아래에서, new OrderedProductService(orderedProductModel) 하면, 이 함수의 인자로 전달됨
	constructor(orderedProductModel) {
		this.orderedProductModel = orderedProductModel;
	}

	//테스트
	async findByOrderId(orderId) {
		const orders = await this.orderedProductModel.findByOrderId(orderId);
		return orders;
	}

	// 주문상품목록 추가
	async addOrderedProduct(orderInfo) {
		// 객체 destructuring
		// 여기서 product는 product._id가 필요함
		const { orderId, product, numbers } = orderInfo;

		// db에 저장
		const createdNewOrderedProduct = await this.orderedProductModel.create(
			orderInfo,
		);

		return createdNewOrderedProduct;
	}

	// order Schema의 orderId를 찾아와야함
	async getOrderedProduct(orderId) {
		const orderedProducts = await this.orderedProductModel.findById({
			orderId,
		});
		return orderedProducts;
	}

	// 모든 주문목록 찾기
	async getAllOrderProducts() {
		const orderedProducts = await this.orderedProductModel.findAll();
		return orderedProducts;
	}

	// 주문목록 삭제 order Schema에서 orderId 찾아와야함.
	async deleteOrderedProduct(orderId) {
		await this.orderedProductModel.delete(orderId);
		return;
	}
}

const orderedProductService = new OrderedProductService(orderedProductModel);

export { orderedProductService };
