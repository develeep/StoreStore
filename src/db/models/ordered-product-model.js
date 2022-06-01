import { model } from 'mongoose';
import { OrderedProductSchema } from '../schemas/ordered-product-schema';

const OrderedProduct = model('orderedProduct', OrderedProductSchema);

export class OrderProductModel {
	async findByOrderId(orderId) {
		const orderedProducts = await OrderedProduct.find({ orderId });
		return orderedProducts;
	}

	async create(orderInfo) {
		const createdNewOrderedProduct = await OrderedProduct.create(orderInfo);
		return createdNewOrderedProduct;
	}

	async findAll() {
		const orderedProducts = await OrderedProduct.find({});
		return orderedProducts;
	}

	async delete(orderId) {
		await OrderedProduct.deleteMany({ orderId });
		return;
	}
}

const orderedProductModel = new OrderProductModel();

export { orderedProductModel };
