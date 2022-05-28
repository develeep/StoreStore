import { orderModel } from '../db';

import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

class OrderService {
	// 본 파일의 맨 아래에서, new OrderService(orderModel) 하면, 이 함수의 인자로 전달됨
	constructor(orderModel) {
		this.orderModel = orderModel;
	}

	// 주문 추가
	async addOrder(orderInfo) {
		// 객체 destructuring
		// buyer 변수에 user ObjectId를 줘야 함, receiver는 object
		const { buyer, priceSum, receiver, deliveryStatus } = orderInfo;

		// db에 저장
		const createdNewOrder = await this.orderModel.create(orderInfo);

		return createdNewOrder;
	}

	// order shortId로 order 찾기
	async getOrder(orderId) {
		const order = await this.orderModel.findById(orderId);
		return order;
	}

	// 모든 주문 찾기
	async getAllOrders() {
		const orders = await this.orderModel.findAll();
		return orders;
	}

	// 주문 삭제
	async deleteOrder(orderId) {
		await this.orderModel.delete(orderId);
		return;
	}

	// 배송지 조회
	async getAddress(orderId) {
		const address = await this.orderModel.getAddressById(orderId);
		return address;
	}

	// 특정 사용자의 모든 주문을 조회
	// buyerId 구현해야함
	async getOrdersByBuyer(buyerId) {
		const orders = await this.orderModel.getOrdersByBuyerId(buyerId);
		return orders;
	}

	// priceSum 추가위한 함수
	async updateForPriceSum(orderId, toUpdate) {
		const order = await this.orderModel.update({
			orderId,
			update: toUpdate,
		});
		return order;
	}
}

const orderService = new OrderService(orderModel);

export { orderService };
