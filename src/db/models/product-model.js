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
		const product = await Product.findOne({ productId }).populate('review');
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

	async getNext8Products(page) {
		const products = await Product.find({})
			.sort({ salesRate: -1 })
			.skip(8 * page)
			.limit(8);
		return products;
	}

	async Search(keyword) {
		let keywords = keyword.split(' ');
		const keywordfind = [];
		keywords.forEach((el) => {
			keywordfind.push({ name: { $regex: `${el}` } });
		});
		const searchData = await Product.find({
			$and: keywordfind,
		});
		return searchData;
	}

	async findNewest() {
		const products = await Product.find({}).sort({ createdAt: -1 });
		return products;
	}

	async findNewestWithCategory() {
		const products = await Product.find({})
			.sort({ createdAt: -1 })
			.populate('category', 'name');
		return products;
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

	async deleteByCategory(category) {
		await Product.deleteMany({ category });
		return;
	}

	async findCategoryNameById(productId) {
		const product = await Product.findOne({ productId }).populate({
			path: 'category',
			populate: { path: 'bCategory' },
		});
		console.log(product);
		const categoryName =
			product.category.bCategory.name + '/' + product.category.name;
		return categoryName;
	}
}

const productModel = new ProductModel();

export { productModel };
