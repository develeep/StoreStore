import { productModel } from '../db';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

class ProductService {
	// 본 파일의 맨 아래에서, new ProductService(productModel) 하면, 이 함수의 인자로 전달됨
	constructor(productModel) {
		this.productModel = productModel;
	}

	// 상품 추가
	async addProduct(productInfo) {
		// 객체 destructuring
		const {
			category,
			name,
			price,
			imageUrl,
			description,
			inventory,
			company,
			imageKey,
		} = productInfo;

		// db에 저장
		const createdNewProduct = await this.productModel.create(productInfo);

		return createdNewProduct;
	}
	// product shortId로 product 찾아서 반환
	async getProductById(productId) {
		const product = await this.productModel.findById(productId);
		return product;
	}

	// 랭킹순으로(많이 팔린 순) 상품 가져오기
	async getRankedProducts() {
		const products = await this.productModel.getRankedProduct();
		return products;
	}

	// 최신순으로 상품 가져오기
	async getNewestProducts() {
		const products = await this.productModel.findNewest();
		return products;
	}

	async getNewestProductsWithCategory() {
		const products = await this.productModel.findNewestWithCategory();
		return products;
	}

	async getCategoryNameById(productId) {
		const categoryName = await this.productModel.findCategoryNameById(
			productId,
		);
		return categoryName;
	}

	// product DB에서 랜덤으로 8개의 상품을 가져옴 -> 메인페이지에 띄워줄 용도
	async getRank_8_Product() {
		const products = await this.productModel.findRank_8_Product();
		return products;
	}

	async getNext8Products(page) {
		const products = await this.productModel.getNext8Products(page);
		return products;
	}

	async getCategory8Products(page) {
		const products = await this.productModel.getCategory8Products(page);
		return products;
	}

	// 카테고리 별로 모아보기
	async getProductsByCategory(category) {
		const products = await this.productModel.findBycategory(category);
		return products;
	}

	// 카테고리 최신 상품 찾기
	async Categorylatestproduct(categorys) {
		const products = await this.productModel.findBycategorys(categorys);
		return products;
	}

	async deleteProductByProductId(productId) {
		await this.productModel.delete(productId);
		return;
	}

	// 상품 검색 불러오기
	async SearchProducts(keyword) {
		const searchData = await this.productModel.Search(keyword);
		return searchData;
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

	// B 카테고리별 상품 수집
	async BgetCategoryOne(category_Id) {
		let Products = await this.productModel.CategoryfindAll();
		Products = Products.filter(
			(el) => String(el.category.bCategory) === String(category_Id),
		);
		return Products;
	}

	// S 카테고리별 상품 수집
	async SgetCategoryOne(category_Id) {
		let Products = await this.productModel.CategoryfindAll();
		Products = Products.filter(
			(el) => String(el.category._id) === String(category_Id),
		);
		return Products;
	}

	// 카테고리 삭제 시 속해있는 상품 모두 삭제, 인자로 ScategoryId 받아야 함
	async deleteProductBySCategoryId(category) {
		await this.productModel.deleteByCategory(category);
		return;
	}

	// 테스트용 product 전부 삭제
	async deleteAllProducts() {
		await this.productModel.deleteAll();
		return;
	}
}

const productService = new ProductService(productModel);

export { productService };
