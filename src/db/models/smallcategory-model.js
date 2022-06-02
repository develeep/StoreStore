import { model } from 'mongoose';
import { smallCategorySchema } from '../schemas/small-category-schema';

const SmallCategory = model('scategory', smallCategorySchema);

export class SmallCategoryModel {
	async create(category_info) {
		const createdNewUser = await SmallCategory.create(category_info);
		return createdNewUser;
	}

	async findAll() {
		let categorys = await SmallCategory.find({}).populate('bCategory');
		let categoryObject = {};
		for (let iv of categorys) {
			const scategory = iv.name;
			const bcategory = iv.bCategory.name;
			if (categoryObject[bcategory] == undefined) {
				categoryObject[bcategory] = [scategory];
			} else {
				let categoryList = categoryObject[bcategory];
				categoryList.push(scategory);
				categoryObject[bcategory] = categoryList;
			}
		}
		return categoryObject;
	}

	async findById(name) {
		const OneCategory = await SmallCategory.findOne({ name: name });
		return OneCategory;
	}

	async BfindById(name) {
		let Bcategorys = await SmallCategory.find({}).populate('bCategory');
		Bcategorys = Bcategorys.filter((el) => el.bCategory.name == name);
		return Bcategorys;
	}

	async delete(name) {
		const deletename = await SmallCategory.deleteOne({ name: name });
		return deletename;
	}
	async updateCategory(olddata, toUpdate) {
		const filter = { name: olddata };
		const option = { returnOriginal: false };

		const updateCategory = await SmallCategory.findOneAndUpdate(
			filter,
			toUpdate,
			option,
		);
		return updateCategory;
	}
}

const smallCategoryModel = new SmallCategoryModel();

export { smallCategoryModel };
