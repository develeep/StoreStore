import * as Api from '/api.js';
import { addTable } from '../cart/cartTable.js';
import { Cart } from '/CartClass.js';
import { addCommas } from '/useful-functions.js';
import { getElement, getElementAll } from '/useful-functions.js';

const fullNameInput = getElement('#nameInput');
const phoneNumberInput = getElement('#phoneNumberInput');
const requestSelectBox = getElement('#requestSelectBox');
const writeOption = getElement('#writeOption');
const writeOptionSaveButton = getElement('#writeOptionSaveButton');
const postalCodeDiv = getElement('#postcodeInput');
const addressDiv = getElement('#addressInput');
const detailAddressDiv = getElement('#detailAddressInput');

let selectResult = '';

const order = new Cart();
order.getStore('order');

addAllEvents();
addAllElements();

function addAllElements() {}

function addAllEvents() {
	getOrder();
	getUserInfo();
	const checkOutButton = document.querySelector('#checkoutButton');
	// 2. 결제하기 버튼을 눌렀을 시 결제되어 최종주문된 상품 DB 추가, 주문조회에 추가 => 이후 주문조회에서 주문취소 버튼 만들기
	checkOutButton.addEventListener('click', payment);
	// 요청사항
	requestSelectBox.addEventListener('change', selectWrite);
	writeOptionSaveButton.addEventListener('click', saveWriteOption);
}

// 1. 화면 로딩 시 주문자 정보 렌더링
async function getUserInfo() {
	try {
		const userData = await Api.get('/api/users');
		fullNameInput.value = userData.fullName;
		if (userData.phoneNumber) {
			phoneNumberInput.value = userData.phoneNumber;
		}
		if (userData.address) {
			const { postalCode, address1, address2 } = userData.address;
			postalCodeDiv.value = postalCode;
			addressDiv.value = address1;
			detailAddressDiv.value = address2;
		}
		selectWrite();
	} catch (err) {
		console.error(err.stack);
		swal(err.message).then(() => {
			const loc = location.href;
			const encodeURI = encodeURIComponent(loc);
			location.href = `/login?beforeURI=${encodeURI}`;
		});
	}
}
// 장바구니 랜더링
function getOrder() {
	const orderCart = JSON.parse(localStorage.getItem('order'));
	const cartBox = getElement('.cart-product-box');

	const cartList = document.createElement('ul');
	cartList.classList.add('cart-seller-list');

	orderCart.forEach((cart) => {
		const cartItem = addTable(cart);
		cartList.append(cartItem);
		cartBox.append(cartList);
	});

	const minusBtn = getElementAll('.num_minus_btn');
	const plusBtn = getElementAll('.num_plus_btn');
	minusBtn.forEach((btn) => {
		btn.addEventListener('click', updateNum);
	});
	plusBtn.forEach((btn) => {
		btn.addEventListener('click', updateNum);
	});

	hideBox();
	getOrderPage();
}
// 결제정보 랜더링
function getOrderPage() {
	const orderTotal = getElement('#orderTotal');
	const allPrice = getAllPrice();
	orderTotal.textContent = `${addCommas(allPrice + 3000)}원`;

	const orderProducts = getElement('#productsTitle');
	orderProducts.textContent = getOrderProduct();

	const productsTotal = getElement('#productsTotal');
	productsTotal.textContent = `${addCommas(allPrice)}원`;
}

// 불필요한 부분 삭제
function hideBox() {
	const checkboxAll = getElementAll('.check-btn-box');
	checkboxAll.forEach((check) => {
		check.classList.add('hide');
	});
	const orderBtn = getElementAll('.btn-item-buy');
	orderBtn.forEach((btn) => {
		btn.remove();
	});
}

// 주문상품 목록 출력
function getOrderProduct() {
	const checkBtnAll = getElementAll('.check-btn-box input[type="checkbox"]');
	let products = '';
	checkBtnAll.forEach((check) => {
		const cart = order.find(check.id);
		products += cart.product + ' / ';
	});
	return products;
}

// 상품금액 출력
function getAllPrice() {
	const checkBtnAll = getElementAll('.check-btn-box input[type="checkbox"]');
	let allPrice = 0;
	checkBtnAll.forEach((check) => {
		const id = check.id;
		const cart = order.find(id);
		allPrice += cart.price * cart.num;
	});
	return allPrice;
}

// 수량 업다운
function updateNum(e) {
	const cartList = getElement('.cart-seller-list');
	const upDown = e.target.textContent;
	const cartItem = e.target.closest('li');
	const id = cartItem.querySelector('.check-btn-box input[type="checkbox"]').id;
	const item = order.find(id);

	if (upDown == '-') {
		if (item.num === 1) {
			return;
		}
		item.num -= 1;
	} else if (upDown == '+') {
		item.num += 1;
	}

	order.update(item);
	console.log(order.value());
	localStorage.setItem('order', order.valueOf());
	cartList.remove();
	getOrder();
}

// 요청사항 selectbox
function selectWrite() {
	const options = requestSelectBox.selectedOptions;

	if (options[0].label != '직접 입력') {
		writeOption.style.display = 'none';
		writeOptionSaveButton.style.display = 'none';
		selectResult = options[0].label;
		console.log(selectResult);
	} else {
		writeOption.style.display = 'block';
		writeOptionSaveButton.style.display = 'block';
		console.log('직접입력을 선택했습니다.');
	}
}

function saveWriteOption(e) {
	e.preventDefault();
	if (writeOptionSaveButton.innerHTML == '저장') {
		selectResult = writeOption.value;
		console.log(selectResult);
		swal('요청사항이 저장되었습니다.');
		writeOption.disabled = true;
		writeOptionSaveButton.innerHTML = '수정';
	} else {
		writeOption.disabled = false;
		writeOptionSaveButton.innerHTML = '저장';
	}
}

async function payment(e) {
	e.preventDefault();
	try {
		const receiveAddress = {
			receiverPostalCode: postalCodeDiv.value,
			receiverAddress: addressDiv.value,
			receiverAddress2: detailAddressDiv.value,
		};
		const order = JSON.parse(localStorage.getItem('order'));
		const data = {
			nameInput: fullNameInput.value,
			addressInput: Object.values(receiveAddress).join(' '),
			phoneNumberInput: phoneNumberInput.value,
			requestSelectBox: selectResult,
			orderProducts: order,
		};
		const result = await Api.post('/api/ordes', data);
		console.log(result);
		location.href = `/payment/${result.orderId}`;
	} catch (err) {
		swal(`결제중 문제가 발생하였습니다. ${err.message}`);
	}
}
