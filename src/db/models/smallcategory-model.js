import { model } from 'mongoose';
import { smallCategorySchema } from '../schemas/small-category-schema';

const SmallCategory = model('scategory', smallCategorySchema);

export class SmallCategoryModel {
	async create(category_info) {
		const createdNewUser = await SmallCategory.create(category_info);
		return createdNewUser;
	}
}

const SmallcateModel = new SmallCategoryModel();

export { SmallcateModel };
