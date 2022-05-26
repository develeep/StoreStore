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
}

const SmallcateModel = new SmallCategoryModel();

export { SmallcateModel };
