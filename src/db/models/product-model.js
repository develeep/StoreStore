import { model } from 'mongoose';
import { ProductSchema } from '../schemas/product-schema';

const Product = model('products', ProductSchema);

export class ProductModel {
	async findBycategory(category) {
		const products = await Product.find({ category });
		return products;
	}

	async findByName(name) {
		const product = await Product.findOne({ name });
		return product;
	}

	async create(productInfo) {
		const createdNewProduct = await Product.create(productInfo);
		return createdNewProduct;
	}

	async findAll() {
		const products = await Product.find({});
		return products;
	}

	async findRank_8_Item() {
		const rank_8_Products = await Product.find({})
			.sort({ purchageQuantity: -1 })
			.limit(8);
		return rank_8_Products;
	}

	async update({ productId, update }) {
		const filter = { _id: productId };
		const option = { returnOriginal: false };

		const updatedProduct = await Product.findOneAndUpdate(
			filter,
			update,
			option,
		);
		return updatedProduct;
	}
	async delete(productId) {
		await Product.deleteOne({ _id: productId });
		return;
	}
}

const productModel = new ProductModel();

export { productModel };
