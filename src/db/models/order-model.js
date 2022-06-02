import { model } from 'mongoose';
import { OrderSchema } from '../schemas/order-schema';

const Order = model('orders', OrderSchema);

export class OrderModel {
	async findById(orderId) {
		const order = await Order.findOne({ orderId });
		return order;
	}

	async create(orderInfo) {
		const createdNewOrder = await Order.create(orderInfo);
		return createdNewOrder;
	}

	async findAll() {
		const orders = await Order.find({}).populate('buyer', 'fullName');
		return orders;
	}

	async delete(orderId) {
		await Order.deleteOne({ orderId });
		return;
	}
	// 배송지 조회
	async getAddressById(orderId) {
		const address = await Order.findOne(orderId).receiver.address;
		return address;
	}

	// buyer가 ref Type 이므로, 이 함수를 부를 때 buyerId(ObjectId형태)를 넘겨줘서 찾는다.
	async getOrdersByBuyerId(buyerId) {
		const orders = await Order.find({ buyer: buyerId });
		return orders;
	}

	// 주문 update
	async update({ orderId, update }) {
		const filter = { orderId };
		const option = { returnOriginal: false };

		const updatedOrder = await Order.findOneAndUpdate(filter, update, option);
		return updatedOrder;
	}
}

const orderModel = new OrderModel();

export { orderModel };
