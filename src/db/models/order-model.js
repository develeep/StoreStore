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
		const orders = await Order.find({});
		return orders;
	}

	async update({ orderId, update }) {
		const filter = { orderId };
		const option = { returnOriginal: false };

		const updatedOrder = await Order.findOneAndUpdate(filter, update, option);
		return updatedOrder;
	}
	async delete(orderId) {
		await Order.deleteOne({ orderId });
		return;
	}
	// 배송지 조회, 배송지는 user.address1 user.address2(부산 해운대구 APEC로 17 101동 101호) 식으로 리턴함
	async getAddressById(orderId) {
		const order = await Order.findOne(orderId).populate('buyer');
		const address =
			order.user.address.address1 + ' ' + order.user.address.address2;
		return address;
	}

	// buyer가 ref Type 이므로, 이 함수를 부를 때 buyerId(ObjectId형태)를 넘겨줘서 찾는다.
	async getOrdersByBuyerId(buyerId) {
		const orders = await Order.find({ buyer: buyerId });
		return orders;
	}
}

const orderModel = new OrderModel();

export { orderModel };
