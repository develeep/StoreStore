import { smallCategoryModel } from '../db';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

class SmallcategoryService {
	// 본 파일의 맨 아래에서, new UserService(userModel) 하면, 이 함수의 인자로 전달됨
	constructor(smallCategoryModel) {
		this.smallCategoryModel = smallCategoryModel;
	}

	async addCategory(categoryInfo) {
		const newCategory = await this.smallCategoryModel.create(categoryInfo);

		return newCategory;
	}

	async getCategories() {
		const Categorys = await this.smallCategoryModel.findAll();
		return Categorys;
	}

	async getCategoryname(name) {
		const oneCategory = await this.smallCategoryModel.findById(name);
		return oneCategory;
	}

	async getbCategoryname(name) {
		const bCategory = await this.smallCategoryModel.BfindById(name);
		return bCategory;
	}

	// 사용자 삭제
	async deleteCategory(name) {
		// db에서 삭제
		const deletename = await this.smallCategoryModel.delete(name);

		return deletename;
	}

	async updateCategory(olddata, toUpdate) {
		const updateData = await this.smallCategoryModel.updateCategory(
			olddata,
			toUpdate,
		);

		return updateData;
	}
}

const smallCategoryService = new SmallcategoryService(smallCategoryModel);

export { smallCategoryService };
