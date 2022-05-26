import { Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { loginRequired } from '../middlewares';
import { productService } from '../services';
import bcrypt from 'bcrypt';
import { isAdmin } from '../middlewares/isAdmin';

const productRouter = Router();

// 판매 최상위 8개 상품 가져오기
productRouter.get('/getbestprodcut', async (req, res, next) => {
	try {
		const products = await productService.getRank_8_Item();
		res.status(200).json(products);
	} catch (error) {
		next(err);
	}
});

// 카테고리 별 조회 -> /api/productlist
productRouter.get(
	'/productist',
	loginRequired,
	isAdmin,
	async (req, res, next) => {
		try {
			if (is.emptyObject(req.body)) {
				throw new Error(
					'headers의 Content-Type을 application/json으로 설정해주세요',
				);
			}
			const products = await productService.getProductsByCategory(category);
			res.status(200).json(products);
		} catch (error) {
			next(error);
		}
	},
);

// 상품등록 -> /api/productRegister
productRouter.post(
	'/productregister',
	loginRequired,
	isAdmin,
	async (req, res, next) => {
		try {
			// Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
			// application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
			if (is.emptyObject(req.body)) {
				throw new Error(
					'headers의 Content-Type을 application/json으로 설정해주세요',
				);
			}

			// 카테고리를 폼에서 입력했을 거란 가정하에..
			const category = req.body.category;

			// 카테고리 스키마에서 category로 _id 얻어오기
			// const categoryId = ~~~~(category);

			// req (request)의 body 에서 데이터 가져오기

			const name = req.body.name;
			const price = req.body.price;
			const imageUrl = req.body.imageUrl;
			const description = req.body.description;
			const inventory = req.body.inventory;

			// 위 데이터를 product db에 추가하기
			const newProdcut = await productService.addProduct({
				category: categoryId, // 추후 카테고리 스키마에서 카테고리 id 얻어오기,
				name,
				price,
				imageUrl,
				description,
				inventory,
			});

			// 추가된 상품의 db 데이터를 프론트에 다시 보내줌
			// 물론 프론트에서 안 쓸 수도 있지만, 편의상 일단 보내 줌
			res.status(201).json(newProdcut);
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

			const { category, name, price, imageUrl, description, inventory } =
				req.body;

			const toUpdate = {
				...(category && { category }),
				...(name && { name }),
				...(price && { price }),
				...(imageUrl && { imageUrl }),
				...(description && { description }),
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

			// front에서 이렇게 줄 것이라 예상
			const productId = req.body.productId;

			await productService.deleteProductByProductId(productId);
			res.status(200).json({ status: 'ok' });
		} catch (error) {
			next(error);
		}
	},
);

export { productRouter };
