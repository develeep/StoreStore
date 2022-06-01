import { addTable, allPriceTable } from './cartTable.js';
import * as Api from '/api.js';
import { renderGnb } from '/renderGnb.js';
import { Cart } from '/CartClass.js';
import { getElement, getElementAll } from '/useful-functions.js';

const newCart = new Cart();
const orderCart = new Cart();
orderCart.getStore('cart');
localStorage.setItem('order', orderCart.valueOf());

addAllElements();

addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
	getCart();
}
// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
	const deleteChoice = getElement('.delete_choice');
	const deleteAllBtn = getElement('.delete_all');
	const orderBtn = getElement('.order-btn');
	deleteChoice.addEventListener('click', delChoice);
	deleteAllBtn.addEventListener('click', deleteAll);
	orderBtn.addEventListener('click', goPayment);
}

// 페이지 시작 or cart 변화 시 카트 정보를 가져와	나타내는 함수
function getCart() {
	const cart = JSON.parse(localStorage.getItem('cart'));
	const deleteBtn = getElement('.delete_btn');
	const cartTable = getElement('.container .cart-product-box');
	const emptyTable = getElement('.empty');
	const orderBtn = getElement('.order-btn-line');
	const priceInfo = getElement('.payment-price-info');

	if (!cart) {
		// 장바구니가 없을시 장바구니를 추가해주라는 화면이 뜸
		cartTable.classList.add('hide');
		emptyTable.classList.remove('hide');
		deleteBtn.classList.add('hide');
		orderBtn.classList.add('hide');
		priceInfo.classList.add('hide');
		emptyTable.classList.add('empty-table');
		return;
	}
	// newCart에 아이템 추가(변경사항 있을시)
	newCart.getStore('cart');
	// orderCart에 아이템 추가
	orderCart.getStore('order');

	// 장바구니가 있을시 장바구니 화면 띄움
	cartTable.classList.remove('hide');
	deleteBtn.classList.remove('hide');
	orderBtn.classList.remove('hide');
	priceInfo.classList.remove('hide');

	// 장바구니 목록 생성
	const cartList = document.createElement('ul');
	cartList.classList.add('cart-seller-list');

	cart.forEach((cartObject) => {
		const cartItem = addTable(cartObject);
		cartList.append(cartItem);
		cartTable.append(cartList);
	});

	// 총 합 가격 생성
	addAllPrice();

	getEvent();
}

// 최초 시작시 요소 불러온 후 이벤트 설정
function getEvent() {
	const minusBtn = getElementAll('.num_minus_btn');
	const plusBtn = getElementAll('.num_plus_btn');
	const checkAll = getElement('#check_all');
	const buyBtn = getElementAll('.btn-item-buy');

	buyBtn.forEach((btn) => {
		btn.addEventListener('click', orderOne);
	});

	checkAll.addEventListener('change', checkedAll);
	checkEvent();
	minusBtn.forEach((btn) => {
		btn.addEventListener('click', updateNum);
	});
	plusBtn.forEach((btn) => {
		btn.addEventListener('click', updateNum);
	});
}

// 총합 가격 테이블 생성 함수
function addAllPrice() {
	const container = getElement('.container');
	const priceInfo = getElement('.payment-price-info');
	const allPrice = getAllPrice();
	const payment = allPriceTable(allPrice);

	if (priceInfo.childElementCount != 0) {
		priceInfo.querySelector('.payment-price-info-box').remove();
	}

	priceInfo.append(payment);
}

// 체크된 항목 가격 불러오기 함수
function getAllPrice() {
	const checkBtnAll = getElementAll('.check-btn-box input[type="checkbox"]');
	const cartList = getElement('.cart-seller-list');
	let allPrice = 0;

	checkBtnAll.forEach((check) => {
		if (check.checked) {
			const id = check.id;
			const cart = newCart.find(id);
			allPrice += cart.price * cart.num;
		}
	});
	return allPrice;
}

// 전체 체크 클릭시 체크박스들 전체 체크하는 함수
function checkedAll() {
	const checkAll = getElement('#check_all');
	const checkBtnAll = getElementAll('.check-btn-box input[type="checkbox"]');
	checkBtnAll.forEach((check) => {
		check.checked = checkAll.checked;
	});
	if (checkAll.checked) {
		orderCart.getStore('cart');
		localStorage.setItem('order', orderCart.valueOf());
	} else {
		orderCart.deleteAll();
		localStorage.setItem('order', orderCart.valueOf());
	}
	addAllPrice();
}

// 체크박스 전체 선택 상태에서 만약 하나라도 체크박스가 체크가 풀리면 전체 체크 체크박스도 풀리는 함수
function checkEvent() {
	const checkAll = getElement('#check_all');
	const checkBtnAll = getElementAll('.check-btn-box input[type="checkbox"]');
	checkBtnAll.forEach((check) => {
		check.addEventListener('change', () => {
			if (!check.checked) {
				checkAll.checked = false;
				if (orderCart.has(check.id)) {
					orderCart.delete(check.id);
				}
			} else {
				const item = newCart.find(check.id);
				orderCart.add(item);
				if (newCart.value().length === orderCart.value().length) {
					checkAll.checked = true;
				}
			}

			localStorage.setItem('order', orderCart.valueOf());
			addAllPrice();
		});
	});
}

// 선택된 항목을 삭제하는 함수
function delChoice() {
	let checking = false;
	const checkBtnAll = getElementAll('.check-btn-box input[type="checkbox"]');
	const cartList = getElement('.cart-seller-list');
	checkBtnAll.forEach((check) => {
		if (check.checked) {
			if (newCart.has(check.id)) {
				newCart.delete(check.id);
			}
			checking = true;
		}
	});
	if (!checking) {
		swal('물품을 선택해 주세요.');
		return;
	}
	cartList.remove();
	swal('선택된 물품이 삭제되었습니다.');
	if (JSON.parse(newCart.valueOf()).length === 0) {
		localStorage.removeItem('cart');
		localStorage.removeItem('order');
		getCart();
	} else {
		localStorage.setItem('cart', newCart.valueOf());
		orderCart.deleteAll();
		orderCart.getStore('cart');
		localStorage.setItem('order', orderCart.valueOf());
		getCart();
	}
}

// 전체 항목 삭제 함수
function deleteAll() {
	const cartList = getElement('.cart-seller-list');
	cartList.remove();
	localStorage.removeItem('cart');
	localStorage.removeItem('order');
	swal('장바구니가 삭제되었습니다.');
	getCart();
}

// +,- 버튼에 따라 구매 수량이 변하는 함수
function updateNum(e) {
	const cartList = getElement('.cart-seller-list');
	const upDown = e.target.textContent;
	const cartItem = e.target.closest('li');
	const id = cartItem.querySelector('.check-btn-box input[type="checkbox"]').id;
	const item = newCart.find(id);

	if (upDown === '-') {
		if (item.num === 1) {
			return;
		}
		item.num -= 1;
	} else if (upDown === '+') {
		item.num += 1;
	}

	newCart.update(item);
	localStorage.setItem('cart', newCart.valueOf());
	orderCart.getStore('cart');
	localStorage.setItem('order', orderCart.valueOf());
	cartList.remove();
	getCart();
}

function orderOne(e) {
	const li = e.target.closest('li');
	const productId = li.querySelector(
		'.check-btn-box input[type="checkbox"]',
	).id;
	const cart = newCart.find(productId);
	const arr = [cart];
	localStorage.setItem('order', JSON.stringify(arr));
	window.location.href = '/payment';
}
// 임시 카트 데이터 생성 함수
function createExamData() {
	const cart = new Cart();
	const item1 = {
		src: 'https://cdn.pixabay.com/photo/2016/04/01/09/58/bathroom-1299704_960_720.png',
		product: 'test1',
		price: 10000,
		num: 2,
		id: 'qwerasdf',
	};
	const item2 = {
		src: 'https://cdn.pixabay.com/photo/2016/04/01/09/58/bathroom-1299704_960_720.png',
		product: 'test2',
		price: 10000,
		num: 2,
		id: 'qwerasdfd',
	};
	const item3 = {
		src: 'https://cdn.pixabay.com/photo/2016/04/01/09/58/bathroom-1299704_960_720.png',
		product: 'test3',
		price: 10000,
		num: 2,
		id: 'qwerasdfg',
	};
	const item4 = {
		src: 'https://cdn.pixabay.com/photo/2016/04/01/09/58/bathroom-1299704_960_720.png',
		product: 'test1',
		price: 20000,
		num: 2,
		id: 'qwerasdf',
	};
	cart.add(item1);
	cart.add(item2);
	cart.add(item3);
	console.log(cart.valueOf());
	localStorage.setItem('cart', cart.valueOf());
	console.log(cart.all());
	cart.update(item4);
	console.log(cart.valueOf());
}

function goPayment() {
	if (getAllPrice() === 0) {
		swal('물품을 선택해 주세요');
		return;
	}
	location.href = '/payment';
}
