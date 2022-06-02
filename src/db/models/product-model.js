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

	async findByObjectId(objectId) {
		const product = await Product.findOne({ _id: objectId });
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

	async CategoryB8findAll(category_Id, page) {
		let category_list = [];
		category_Id.forEach((el) => {
			category_list.push({ category: el._id });
		});
		const Categoryproducts = await Product.find({
			$or: category_list,
		})
			.sort({ salesRate: -1, _id: 1 })
			.skip(16 * Number(page))
			.limit(16);
		return Categoryproducts;
	}

	async CategoryS8findAll(category_Id, page) {
		const Categoryproducts = await Product.find({ category: category_Id })
			.sort({ salesRate: -1, _id: 1 })
			.skip(16 * Number(page))
			.limit(16);
		return Categoryproducts;
	}

	async getRankedProduct() {
		const productsRanked = await Product.find({}).sort({
			salesRate: -1,
		});
		return productsRanked;
	}

	async getNextProducts(page) {
		const products = await Product.find({})
			.sort({ salesRate: -1, _id: 1 })
			.skip(16 * Number(page))
			.limit(16);
		return products;
	}

	async getNextNewestProducts(page) {
		const products = await Product.find({})
			.sort({ createdAt: -1, _id: 1 })
			.skip(16 * Number(page))
			.limit(16);
		return products;
	}

	async Search(keyword, page) {
		let keywords = keyword.split(' ');
		const keywordfind = [];
		keywords.forEach((el) => {
			keywordfind.push({ name: { $regex: `${el}` } });
		});
		const searchData = await Product.find({
			$and: keywordfind,
		})
			.skip(16 * Number(page))
			.limit(16);
		return searchData;
	}

	async findBycategorys(categoroys) {
		let lastProduct = await Product.find({})
			.populate('category')
			.sort({ createdAt: -1 });
		const latestData = {};
		for (const [key, value] of Object.entries(categoroys)) {
			const categoryName = value.name;
			const categoryId = value._id;
			const filterData = lastProduct.find(
				(e) => String(e.category.bCategory) == String(categoryId),
			);
			latestData[categoryName] = filterData;
		}
		return latestData;
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
		const categoryName =
			product.category.bCategory.name + '/' + product.category.name;
		return categoryName;
	}

	async deleteAll() {
		await Product.deleteMany({});
		return;
	}
}

const productModel = new ProductModel();

export { productModel };
