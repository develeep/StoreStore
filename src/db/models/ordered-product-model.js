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

	// 주문Id에 속한 비용 총합
	async getPriceSum(orderId) {
		let priceSum = 0;
		const orderedProducts = await OrderedProduct.find({ orderId }).populate(
			'product',
		);
		for (let i = 0; i < orderedProducts.length; i++) {
			priceSum += (orderedProducts[i].product.price * orderedProducts[i].numbers);
		}
		console.log(priceSum)
		return priceSum;
	}
}

const orderedProductModel = new OrderProductModel();

export { orderedProductModel };
