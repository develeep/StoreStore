// views-router.js 수정시 충돌할 수 있어서 라우터는 작업 여부 물어보고 변경. 그때까지만 임시 경로로 확인.

import * as Api from '/api.js';
import { renderGnb } from '/renderGnb.js';
import { Cart } from '/CartClass.js';
import {
	randomId,
	getElement,
	getElementAll,
	addCommas,
	createElement,
} from '/useful-functions.js';

const productImageTag = getElement('#productImageTag');
const manufacturerTag = getElement('#manufacturerTag');
const titleTag = getElement('#titleTag');
const priceTag = getElement('#priceTag');
const description = getElement('#detailDescriptionTag');
const addToCartButton = getElement('#addToCartButton');
const purchaseButton = getElement('#purchaseButton');
const cartItem = new Cart();

getProductInfo();
addAllEvents();
addAllElements();

function addAllElements() {
	renderReview();
}

function addAllEvents() {
	addToCartButton.addEventListener('click', addToCart);
	purchaseButton.addEventListener('click', purchase);
}

async function getProductInfo() {
	try {
		// mongoDB에서 해당 id에 맞는 products 데이터 가져오기
		// 테스트: 테스트 구두1을 가져옴 (id:lsd2TYkEnNLNgUXwszw5K)
		const productId = localStorage.getItem('productId');
		const productData = await Api.get('/api/product', productId);
		console.log(productData);
		productImageTag.src = productData.imageUrl;
		manufacturerTag.innerHTML = productData.company;
		titleTag.innerHTML = productData.name;
		priceTag.innerHTML = addCommas(productData.price) + '원';
		description.innerHTML = productData.description;
	} catch (err) {
		console.error(err.stack);
		swal(`상품정보를 받아오지 못했습니다.: ${err.message}`);
	}
}

async function addToCart() {
	// 장바구니에 담고 (장바구니 데이터 추가)
	try {
		// await Api.patch("/api/update", "", )
		await addCart();
		// await Api.patch("/api/update","", item_lsd2TYkEnNLNgUXwszw5K);
	} catch (err) {
		console.error(err.stack);
		swal(
			`장바구니에 데이터를 담는 과정에서 문제가 발생했습니다. 확인 후 다시 시도해 주세요.: ${err.message}`,
		);
	}

	// 장바구니에 담겼고 장바구니 페이지로의 이동여부를 묻는 swal 발생(swal 버튼 두 개 띄우는 것 검색...)
	swal(
		'장바구니에 상품이 추가되었습니다. 장바구니 페이지로 이동하시겠습니까?',
		{
			buttons: {
				cancel: '아니요',
				yes: '네',
			},
		},
	).then((value) => {
		switch (value) {
			case 'cancel':
				break;
			case 'yes':
				location.href = '/cart';
		}
	});
	// 아니오 => 현재 페이지에 잔류
}

async function addCart() {
	try {
		const productId = localStorage.getItem('productId');
		const productData = await Api.get('/api/product', productId);
		const item = {
			// 테스트용. 추후 변수명 수정
			src: productData.imageUrl,
			product: productData.name,
			price: productData.price,
			num: 1,
			id: productId,
		};
		console.log(item.id);
		cartItem.getStore('cart');
		cartItem.add(item);
		cartItem.update(item);
		localStorage.setItem('cart', cartItem.valueOf());
	} catch (err) {
		swal(err.message);
	}
}

async function purchase() {
	// 구매 페이지로 이동
	await addCart();
	const cart = cartItem.find(localStorage.getItem('productId'));
	const arr = [cart];
	localStorage.setItem('order', JSON.stringify(arr));
	window.location.href = '/payment';
}

const radio = document.querySelector('#comment-form');
radio.addEventListener('submit', async (e) => {
	e.preventDefault();

	let star = '';

	radio.rating.forEach((element) => {
		if (element.checked) {
			star = element.id.split('-')[1];
		}
	});

	if (!star) {
		swal('평점을 선택해주세요');
		return;
	}
	try {
		const reviewComment = getElement('#comment-input');
		const productId = localStorage.getItem('productId');

		const reviewObj = {
			comment: reviewComment.value,
			starRate: star,
			productId: productId,
		};
		const review = await Api.post('/api/reviews', reviewObj);
		console.log(review);

		renderReview();
	} catch (err) {
		swal(err.message).then(() => {
			return;
		});
	}
});

async function renderReview() {
	try {
		const productId = localStorage.getItem('productId');
		const fetchData = await Api.get('/api/reviews', productId);
		if (fetchData.hasReview) {
			console.log('no review');
			return;
		}
		const reviews = fetchData.sendReviews;

		const container = getElementAll('.container')[1];
		const beforeCommentList = getElement('.comment-list');
		if (beforeCommentList) {
			beforeCommentList.remove();
		}

		const commentList = createElement('div');
		commentList.classList.add('comment-list');

		reviews.forEach((review) => {
			const reviewTable = addReviewTable(review);
			commentList.append(reviewTable);
		});

		container.append(commentList);
	} catch (err) {
		swal(err.message).then(() => {
			return;
		});
	}
}

function addReviewTable(review) {
	const commentItemBox = createElement('div');
	const nameStar = createElement('div');
	const comment = createElement('input');

	commentItemBox.classList.add('comment-item-box');
	nameStar.classList.add('name-star');
	comment.classList.add('comment');

	const commentUser = createElement('p');
	commentUser.classList.add('comment-item-username');
	commentUser.textContent = review.author;

	const ratingStar = createElement('div');
	ratingStar.classList.add('rating-item');

	const id = randomId();
	for (let i = 5; i > 0; i--) {
		const inputRadio = createElement('input');
		const label = createElement('label');
		inputRadio.type = 'radio';
		inputRadio.name = `rating-${id}`;
		inputRadio.id = `rating-${i}`;
		// inputRadio.disabled = 'true'
		if (i === Number(review.starRate)) {
			inputRadio.checked = 'true';
		}
		ratingStar.append(inputRadio, label);
	}

	comment.value = review.comment;
	// comment.disabled="true"

	nameStar.append(commentUser, ratingStar);
	commentItemBox.append(nameStar, comment);

	return commentItemBox;
}
