import { SmallcateModel } from '../db';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

class SmallcategoryService {
	// 본 파일의 맨 아래에서, new UserService(userModel) 하면, 이 함수의 인자로 전달됨
	constructor(SmallcateModel) {
		this.SmallcateModel = SmallcateModel;
	}

	async addCategory(categoryInfo) {
		const newCategory = await this.SmallcateModel.create(categoryInfo);

		return newCategory;
	}

	async getCategorys() {
		const Categorys = await this.SmallcateModel.findAll();
		return Categorys;
	}

	async getCategoryname(name) {
		const oneCategory = await this.SmallcateModel.findById(name);
		return oneCategory;
	}

	async getbCategoryname(name) {
		const bCategory = await this.SmallcateModel.BfindById(name);
		return bCategory;
	}

	// 사용자 삭제
	async deleteCategory(name) {
		// db에서 삭제
		const deletename = await this.SmallcateModel.delete(name);

		return deletename;
	}

	async updateCategory(olddata, toUpdate) {
		const updateData = await this.SmallcateModel.updateCategory(
			olddata,
			toUpdate,
		);

		return updateData;
	}
}

const SmallcateService = new SmallcategoryService(SmallcateModel);

export { SmallcateService };
