// views-router.js 수정시 충돌할 수 있어서 라우터는 작업 여부 물어보고 변경. 그때까지만 임시 경로로 확인.

import * as Api from '/api.js';
import { loginMatch } from '/loginMatch.js';
import { Cart } from '/CartClass.js';

const productImageTag = document.querySelector('#productImageTag');
const manufacturerTag = document.querySelector('#manufacturerTag');
const titleTag = document.querySelector('#titleTag');
const priceTag = document.querySelector('#priceTag');
const description = document.querySelector('#detailDescriptionTag');
const addToCartButton = document.querySelector('#addToCartButton');
const purchaseButton = document.querySelector('#purchaseButton');

getProductInfo();
addAllEvents();
addAllElements();

function addAllElements() {
	loginMatch();
}

function addAllEvents() {
	addToCartButton.addEventListener('click', addToCart);
	purchaseButton.addEventListener('click', purchase);
}

async function getProductInfo() {
	try {
		// mongoDB에서 해당 id에 맞는 products 데이터 가져오기
		// 테스트: 테스트 구두1을 가져옴 (id:lsd2TYkEnNLNgUXwszw5K)
        const productId = localStorage.getItem('productId')
		const productData = await Api.get('/api/product',productId);
		console.log(productData);
		productImageTag.src = productData.imageUrl;
		manufacturerTag.innerHTML = productData.company;
		titleTag.innerHTML = productData.name;
		priceTag.innerHTML = productData.price + '원';
		description.innerHTML = productData.description;
	} catch (err) {
		console.error(err.stack);
		alert(`상품정보를 받아오지 못했습니다.: ${err.message}`);
	}
}

function addToCart() {
	// 장바구니에 담고 (장바구니 데이터 추가)
	try {
		// await Api.patch("/api/update", "", )
        const itemPrice = priceTag.textContent.slice(0,-1);
		const item = {
			// 테스트용. 추후 변수명 수정
			src: productImageTag.src,
			product: titleTag.textContent,
			price: parseInt(itemPrice),
			num: 1,
			id: localStorage.getItem('productId'),
		};
        console.log(item.id)
		const cartItem = new Cart();
		cartItem.getBefore();
		cartItem.add(item);
		localStorage.setItem('cart', cartItem.valueOf());
		// await Api.patch("/api/update","", item_lsd2TYkEnNLNgUXwszw5K);
		alert('장바구니에 상품이 정상적으로 추가되었습니다.');
	} catch (err) {
		console.error(err.stack);
		alert(
			`장바구니에 데이터를 담는 과정에서 문제가 발생했습니다. 확인 후 다시 시도해 주세요.: ${err.message}`,
		);
	}

	// 장바구니에 담겼고 장바구니 페이지로의 이동여부를 묻는 alert 발생(alert 버튼 두 개 띄우는 것 검색...)
	if (
		confirm(
			'장바구니에 상품이 추가되었습니다. 장바구니 페이지로 이동하시겠습니까?',
		) == true
	) {
		// 예 => 장바구니 페이지로 이동
		window.location.href = '/cart';
	} else {
		// 아니오 => 현재 페이지에 잔류
	}
}

function purchase() {
	// 구매 페이지로 이동
}
