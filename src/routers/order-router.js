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
			for (let i = 0; i < orders.length; i++) {
				const date = orders[i].createdAt;
				let dateKor = new Date(date.getTime());
				let month = dateKor.getMonth() + 1;
				let day = dateKor.getDate();
				let goodDate =
					dateKor.getFullYear() +
					'-' +
					('00' + month.toString()).slice(-2) +
					'-' +
					('00' + day.toString()).slice(-2);
				orders[i]._doc.timeKor = goodDate;
			}
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
		let date = order.createdAt;
		let dateKor = new Date(date.getTime());
		let month = dateKor.getMonth() + 1;
		let day = dateKor.getDate();
		let goodDate =
			dateKor.getFullYear() +
			'-' +
			('00' + month.toString()).slice(-2) +
			'-' +
			('00' + day.toString()).slice(-2);
		order._doc.timeKor = goodDate;
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
		for (let i = 0; i < orders.length; i++) {
			const date = orders[i].createdAt;
			let dateKor = new Date(date.getTime());
			let month = dateKor.getMonth() + 1;
			let day = dateKor.getDate();
			let goodDate =
				dateKor.getFullYear() +
				'-' +
				('00' + month.toString()).slice(-2) +
				'-' +
				('00' + day.toString()).slice(-2);
			orders[i]._doc.timeKor = goodDate;
		}
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

// 주문 추가 -> /api/orders
orderRouter.post('/orders', loginRequired, async (req, res, next) => {
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
		let productList = '';
		let priceSum = 0;
		let products = [];
		// 주문 품목 갯수만큼 순회
		for (let i = 0; i < orderTokens.length; i++) {
			// 재고량 확인, 재고수 - 주문수량 < 0 이면 주문 못하도록, DB접근 횟수 줄이기 위해 상품 배열에 저장
			const product = await productService.getProductById(orderTokens[i].id);
			if (product.inventory - orderTokens[i].num < 0) {
				throw new Error(
					`죄송합니다. \n[${product.name}] 상품 재고 부족입니다.`,
				);
			}
			products.push(product);

			// 주문 상품 간략히 보기 / 총 금액 생성
			priceSum += orderTokens[i].price * orderTokens[i].num;
			if (i === orderTokens.length - 1) {
				productList += `${orderTokens[i].product} ${orderTokens[i].num}`;
			} else {
				productList += `${orderTokens[i].product} ${orderTokens[i].num} / `;
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
			product: productList,
		});
		const orderId = newOrder.orderId;

		for (let i = 0; i < orderTokens.length; i++) {
			// 주문 상세 Schema에 데이터 추가
			let newOrderedProduct = await orderedProductService.addOrderedProduct({
				orderId,
				product: products[i]._id,
				numbers: orderTokens[i].num,
			});
			// Product Schema에 판매량에 개수 추가
			const currentSalesRate = products[i].salesRate;
			const afterSalesRate = currentSalesRate + orderTokens[i].num;
			// Product Schema에 구매한 개수만큼 재고 감소
			const currentInventory = products[i].inventory;
			const afterInventory = currentInventory - orderTokens[i].num;
			const toUpdate = {
				salesRate: afterSalesRate,
				inventory: afterInventory,
			};
			const updatedProduct = await productService.setProduct(
				products[i].productId,
				toUpdate,
			);
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
	loginRequired,
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

			// Product Schema에 구매했던 개수를 재고에 +, 구매했던 개수를 판매량에서 -
			const orderedProducts = await orderedProductService.findByOrderId(
				orderId,
			);
			for (let i = 0; i < orderedProducts.length; i++) {
				const objectId = orderedProducts[i].product;
				const product = await productService.getProductByObjectId(objectId);
				const currentInventory = product.inventory;
				const purchasedAmount = orderedProducts[i].numbers;
				const resultInventory = currentInventory + purchasedAmount;

				const currentSalesRate = product.salesRate;
				const resultSalesRate = currentSalesRate - purchasedAmount;
				const toUpdate = {
					salesRate: resultSalesRate,
					inventory: resultInventory,
				};
				const updatedProduct = await productService.setProduct(
					product.productId,
					toUpdate,
				);
			}

			// 주문 취소 로직 종료 후 주문 상세 Schema에서도 값 지워줌
			await orderedProductService.deleteOrderedProduct(orderId);

			res.status(200).json({ status: 'ok' });
		} catch (error) {
			next(error);
		}
	},
);

// 주문 배송상태 변경
orderRouter.patch('/orders', loginRequired, async function (req, res, next) {
	try {
		// content-type 을 application/json 로 프론트에서
		// 설정 안 하고 요청하면, body가 비어 있게 됨.
		if (is.emptyObject(req.body)) {
			throw new Error(
				'headers의 Content-Type을 application/json으로 설정해주세요',
			);
		}
		const { orderId, deliveryStatus } = req.body;
		const toUpdate = {
			...(deliveryStatus && { deliveryStatus }),
		};
		const updatedOrderInfo = await orderService.setOrder(orderId, toUpdate);
		res.status(200).json(updatedOrderInfo);
	} catch (error) {
		next(error);
	}
});

export { orderRouter };
