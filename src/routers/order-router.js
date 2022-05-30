import { Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { loginRequired, isAdmin } from '../middlewares';
import {
	orderService,
	orderedProductService,
	productService,
} from '../services';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const orderRouter = Router();

// 모든 주문 가져오기, 주문 기본정보/총 금액만 있고 물품정보는 없음.
orderRouter.get(
	'/allorders',
	loginRequired,
	isAdmin,
	async (req, res, next) => {
		try {
			const orders = await orderService.getAllOrders();
			res.status(200).json(orders);
		} catch (error) {
			next(error);
		}
	},
);

// 특정 주문 상세보기(by orderId)
orderRouter.get('/orders/:orderId', async (req, res, next) => {
	try {
		// 여기서 orderId 가 order Schema의 shortId임
		const orderId = req.params.orderId;
		const order = await orderService.getOrder(orderId);
		res.status(200).json(order);
	} catch (error) {
		next(error);
	}
});

// 특정 사람이 주문한 목록 상세보기(by buyerId === user ObjectId)
orderRouter.get('/orders', loginRequired, async (req, res, next) => {
	try {
		// loign되었다면 id를 가져옴
		const buyerId = req.currentUserId;
		let orders = await orderService.getOrdersByBuyer(buyerId);
		let timeKor = [];
		for (let i = 0; i < orders.length; i++) {
			const date = orders[i].createdAt;
			let dateKor = new Date(date.getTime() + 3600000 * 9);
			// let goodDate = dateKor.getFullYear + '-' + dateKor.getMonth
			orders[i]._doc.timeKor = dateKor;
		}
		// let order = JSON.stringify(orders);
		// console.log(typeof order);
		res.status(200).json(orders);
	} catch (error) {
		next(error);
	}
});

// 배송지 조회
orderRouter.get('/address/:orderId', async (req, res, next) => {
	try {
		const orderId = req.params.orderId;
		const address = await orderService.getAddress(orderId);
		res.status(200).json(address);
	} catch (error) {
		next(error);
	}
});

// 주문 추가 -> /api/orderadd
orderRouter.post('/orderadd', loginRequired, async (req, res, next) => {
	try {
		// Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
		// application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
		if (is.emptyObject(req.body)) {
			throw new Error(
				'headers의 Content-Type을 application/json으로 설정해주세요',
			);
		}
		// loign되었다면 id를 가져옴
		const userId = req.currentUserId;
		const { nameInput, addressInput, phoneNumberInput, requestSelectBox } =
			req.body;
		const orderTokens = req.body.orderProducts;

		const receiver = {
			name: nameInput,
			phoneNumber: phoneNumberInput,
			address: addressInput,
		};
		let product = '';
		let priceSum = 0;
		for (let i = 0; i < orderTokens.length; i++) {
			priceSum += orderTokens[i].price * orderTokens[i].num;
			if (i === orderTokens.length - 1) {
				product += `${orderTokens[i].product} ${orderTokens[i].num}`;
			} else {
				product += `${orderTokens[i].product} ${orderTokens[i].num} / `;
			}
		}
		// 배송비 추가
		priceSum += 3000;

		// 위 데이터를 order db에 추가하기
		const newOrder = await orderService.addOrder({
			buyer: userId,
			receiver,
			requestMessage: requestSelectBox,
			priceSum,
			product,
		});
		const orderId = newOrder.orderId;
		// const priceSum = await orderedProductService.getPriceSum(orderId);

		for (let i = 0; i < orderTokens.length; i++) {
			const product = await productService.getProductById(orderTokens[i].id);
			let newOrderedProduct = await orderedProductService.addOrderedProduct({
				orderId,
				product: product._id,
				numbers: orderTokens[i].num,
			});
		}
		// 추가된 상품의 db 데이터를 프론트에 다시 보내줌
		// 물론 프론트에서 안 쓸 수도 있지만, 편의상 일단 보내 줌
		res.status(201).json({ orderId: orderId });
	} catch (error) {
		next(error);
	}
});

// 주문 삭제
orderRouter.delete(
	'/orders/:orderId',
	// loginRequired,
	// isAdmin,
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
			const orderId = req.params.orderId;

			await orderService.deleteOrder(orderId);

			// 주문 상세 Schema에서도 값 지워줘야 함
			await orderedProductService.deleteOrderedProduct(orderId);
			res.status(200).json({ status: 'ok' });
		} catch (error) {
			next(error);
		}
	},
);

export { orderRouter };
