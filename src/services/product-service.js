import { productModel } from '../db';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

class ProductService {
	// 본 파일의 맨 아래에서, new UserService(userModel) 하면, 이 함수의 인자로 전달됨
	constructor(productModel) {
		this.productModel = productModel;
	}

	// 상품 추가
	async addProduct(productInfo) {
		// 객체 destructuring
		const { category, name, price, imageUrl, description, inventory } =
			productInfo;

		// 이름 중복 확인
		const product = await this.productModel.findByName(name);
		if (product) {
			throw new Error(
				'이 상품명은 이미 등록되어있습니다. 다른 상품명을 입력해 주세요.',
			);
		}

		// 상품명 중복은 이제 아니므로, 상품등록을 진행함

		// db에 저장
		const createdNewProduct = await this.userModel.create(productInfo);

		return createdNewProduct;
	}

	// product DB에서 랜덤으로 8개의 상품을 가져옴 -> 메인페이지에 띄워줄 용도
	async getRank_8_Item() {
		const products = await this.productModel.findRank_8_Item();
		return products;
	}

	// 카테고리 별로 모아보기
	async getProductsByCategory(category) {
		const products = await this.productModel.findBycategory(category);
		return products;
	}

	async deleteProductByProductId(productId) {
		await productModel.delete(productId);
	}

	// 상품정보 수정
	async setProduct(productId, toUpdate) {
		// 업데이트 진행
		const product = await this.productModel.update({
			productId,
			update: toUpdate,
		});

		return product;
	}
}

const productService = new ProductService(productModel);

export { productService };
