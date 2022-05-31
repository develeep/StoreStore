import { Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { loginRequired, isAdmin } from '../middlewares';
import { productService, SmallcateService } from '../services';
import upload from '../utils/s3';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const productRouter = Router();

// 판매 최상위 8개 상품 가져오기
productRouter.get('/bestproducts', async (req, res, next) => {
	try {
		const products = await productService.getRank_8_Product();
		res.status(200).json(products);
	} catch (error) {
		next(error);
	}
});

// 가장 많이 팔린 순으로 전체 상품 가져오기
productRouter.get('/rankedproducts', async (req, res, next) => {
	try {
		const rankedProducts = await productService.getRankedProduct();
		res.status(200).json(rankedProducts);
	} catch (error) {
		next(error);
	}
});

// 무한 스크롤을 위한 상품 8개씩 계속 가져오기
productRouter.get('/rankednext8products', async (req, res, next) => {
	try {
		const page = Number(req.query.page);
		// page가 0이면 skip 없이 8개 가져오기, page가 1이면 8개 skip 후 9~16 가져옴
		const rankedNext8Products = await productService.getNext8Products(page);
		res.status(200).json(rankedNext8Products);
	} catch (error) {
		next(error);
	}
});

// 테스트용 상품 상세보기
productRouter.get('/testproduct', async (req, res, next) => {
	try {
		const productId = 'lsd2TYkEnNLNgUXwszw5K';
		const product = await productService.getProductById(productId);
		res.status(200).json(product);
	} catch (error) {
		next(error);
	}
});

// 상품 상세보기
productRouter.get('/product/:productId', async (req, res, next) => {
	try {
		// 여기서 productId 가 product Schema의 shortId임
		const productId = req.params.productId;
		const product = await productService.getProductById(productId);
		res.status(200).json(product);
	} catch (error) {
		next(error);
	}
});

// 카테고리 별 조회 -> /api/productlist
productRouter.get('/productist/:category', async (req, res, next) => {
	try {
		const category = req.params.category;
		const products = await productService.getProductsByCategory(category);
		res.status(200).json(products);
	} catch (error) {
		next(error);
	}
});

// 상품등록 -> /api/productRegister
productRouter.post(
	'/products',
	upload.single('img'),
	// loginRequired,
	// isAdmin,
	async (req, res, next) => {
		try {
			// Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
			// application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
			if (is.emptyObject(req.headers)) {
				throw new Error(
					'headers의 Content-Type을 application/json으로 설정해주세요',
				);
			}

			// 카테고리를 폼에서 입력했을 거란 가정하에..
			const category = req.body.Scategory;

			// 카테고리 스키마에서 category로 _id 얻어오기
			let getCategory = await SmallcateService.getCategoryname(category);
			const categoryId = getCategory._id;
			// req (request)의 body 에서 데이터 가져오기

			const { name, price, description, inventory, company } = req.body;

			// image를 S3에 저장
			// 이후 생성된 url을 받아야 함.
			// middleware에서 s3에 저장
			const imageUrl = req.file.location;
			console.log(req.file);
			console.log(imageUrl);

			// 위 데이터를 product db에 추가하기
			const newProduct = await productService.addProduct({
				category: categoryId, // 추후 카테고리 스키마에서 카테고리 id 얻어오기,
				name,
				price,
				imageUrl,
				description,
				inventory,
				company,
			});

			// 추가된 상품의 db 데이터를 프론트에 다시 보내줌
			// 물론 프론트에서 안 쓸 수도 있지만, 편의상 일단 보내 줌
			res.status(201).json(newProduct);
		} catch (error) {
			next(error);
		}
	},
);

// 상품 수정
productRouter.patch(
	'/productupdate',
	loginRequired,
	isAdmin,
	async function (req, res, next) {
		try {
			// content-type 을 application/json 로 프론트에서
			// 설정 안 하고 요청하면, body가 비어 있게 됨.
			if (is.emptyObject(req.body)) {
				throw new Error(
					'headers의 Content-Type을 application/json으로 설정해주세요',
				);
			}

			// front에서 이렇게 줄 것이라 예상
			const productId = req.body.productId;

			const {
				category,
				name,
				price,
				imageUrl,
				description,
				inventory,
				company,
			} = req.body;

			const toUpdate = {
				...(category && { category }),
				...(name && { name }),
				...(price && { price }),
				...(imageUrl && { imageUrl }),
				...(description && { description }),
				...(company && { company }),
				...(inventory && { inventory }),
			};
			const updatedProductInfo = await productService.setProduct(
				productId,
				toUpdate,
			);

			res.status(200).json(updatedProductInfo);
		} catch (error) {
			next(error);
		}
	},
);

// 상품 삭제
productRouter.delete(
	'/productdelete',
	loginRequired,
	isAdmin,
	async function (req, res, next) {
		try {
			// content-type 을 application/json 로 프론트에서
			// 설정 안 하고 요청하면, body가 비어 있게 됨.
			if (is.emptyObject(req.headers)) {
				throw new Error(
					'headers의 Content-Type을 application/json으로 설정해주세요',
				);
			}

			// front에서 이렇게 줄 것이라 예상 -> shortId로
			const productId = req.body.productId;

			await productService.deleteProductByProductId(productId);
			res.status(200).json({ status: 'ok' });
		} catch (error) {
			next(error);
		}
	},
);

// 카테고리별 상품 수집
productRouter.get('/getProductCategory/:id', async (req, res, next) => {
	const category_name = req.params.id;
	let isSmallcategory = await SmallcateService.getCategoryname(category_name);
	let CategoryProducts;
	if (isSmallcategory == null) {
		let isBigcategory = await SmallcateService.getbCategoryname(category_name);
		CategoryProducts = await productService.BgetCategoryOne(isBigcategory);
	} else {
		isSmallcategory = isSmallcategory._id;
		CategoryProducts = await productService.SgetCategoryOne(isSmallcategory);
	}
	res.status(200).json(CategoryProducts);
});

export { productRouter };
