import { model } from 'mongoose';
import { ProductSchema } from '../schemas/product-schema';

const Product = model('products', ProductSchema);

export class ProductModel {
	async findBycategory(category) {
		const products = await Product.find({ category });
		return products;
	}

	async findByName(name) {
		const product = await Product.find({ name });
		return product;
	}

	async findById(productId) {
		const product = await Product.findOne({ productId });
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

	async CategoryfindAll() {
		const Categoryproducts = await Product.find({}).populate('category');
		return Categoryproducts;
	}

	async getRankedProduct() {
		const productsRanked = await Product.find({}).sort({
			salesRate: -1,
		});
		return productsRanked;
	}

	async findRank_8_Product() {
		const rank_8_Products = await Product.find({})
			.sort({ salesRate: -1 })
			.limit(8);
		return rank_8_Products;
	}

	async update({ productId, update }) {
		const filter = { productId };
		const option = { returnOriginal: false };

		const updatedProduct = await Product.findOneAndUpdate(
			filter,
			update,
			option,
		);
		return updatedProduct;
	}
	async delete(productId) {
		await Product.deleteOne({ productId });
		return;
	}
}

const productModel = new ProductModel();

export { productModel };
