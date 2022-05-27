import { cateModel } from '../db';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

class categoryService {
	// 본 파일의 맨 아래에서, new UserService(userModel) 하면, 이 함수의 인자로 전달됨
	constructor(cateModel) {
		this.cateModel = cateModel;
	}

	async getCategory(categoryInfo) {
		// 카테고리 큰키워드 작은키워드 변수
		const { Bcategory, Scategory } = categoryInfo;
		// 큰 카테고리 옵젝아이디값 찾기
		const BigcategoryId = await this.cateModel.findOne(Bcategory);
		// 카테고리 정보 객체화
		categoryInfo = {
			name: Scategory,
			bCategory: BigcategoryId._id,
		};

		return categoryInfo;
	}

	// 카테고리 목록을 받음.
	async getCategorys() {
		const Bigcategory = await this.cateModel.findAll();
		return Bigcategory;
	}

	// 사용자 삭제
	async deleteUser(userId) {
		// db에서 삭제
		await userModel.delete(userId);

		return;
	}
}

const cateService = new categoryService(cateModel);

export { cateService };
