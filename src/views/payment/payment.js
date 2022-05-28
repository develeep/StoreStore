import * as Api from '/api.js';
import { loginMatch } from '/loginMatch.js'
import { addTable } from '../cart/cartTable.js'
import { Cart } from '/CartClass.js'
import { addCommas } from '/useful-functions.js'

const fullNameInput = document.querySelector('#nameInput');
const phoneNumberInput = document.querySelector('#phoneNumberInput');
const addressInput = document.querySelector('#addressInput');
const requestSelectBox = document.querySelector('#requestSelectBox')
const writeOption = document.querySelector("#writeOption");
const writeOptionSaveButton = document.querySelector('#writeOptionSaveButton');

let selectResult = "";

const order = new Cart();
order.getBefore('order')

getOrder();
addAllEvents();
getUserInfo();
addAllElements();


function addAllElements() {
    loginMatch();
}

function addAllEvents() {
	const checkOutButton = document.querySelector("#checkoutButton")
    // 2. 결제하기 버튼을 눌렀을 시 결제되어 최종주문된 상품 DB 추가, 주문조회에 추가 => 이후 주문조회에서 주문취소 버튼 만들기
	checkOutButton.addEventListener('click', payment)
	// 요청사항
	requestSelectBox.addEventListener('change', selectWrite);
	writeOptionSaveButton.addEventListener('click', saveWriteOption);
}

// 1. 화면 로딩 시 주문자 정보 렌더링
async function getUserInfo() {
	try {
		const userData = await Api.get('/api/update');
		fullNameInput.value = userData.fullName;
		if(userData.phoneNumber){
			phoneNumberInput.value = userData.phoneNumber
		}
        if (userData.address) {
            addressInput.value = Object.values(userData.address).join(" ")
        }
		selectWrite();

	} catch (err) {
		console.error(err.stack);
		alert(`회원정보를 받아오지 못했습니다.: ${err.message}`);
	}
}
// 장바구니 랜더링
function getOrder() {
	const orderCart = JSON.parse(localStorage.getItem('order'))
	const cart_box = document.querySelector('.cart-product-box')

	const cartList = document.createElement('ul');
	cartList.classList.add('cart-seller-list');

	orderCart.forEach(({ src, product, price, num, id }) => {
		const cart_item = addTable(src, product, price, num, id);
		cartList.append(cart_item);
		cart_box.append(cartList);
	});
	
	const minus_btn = document.querySelectorAll('.num_minus_btn');
	const plus_btn = document.querySelectorAll('.num_plus_btn');
	minus_btn.forEach((btn) => {
		btn.addEventListener('click', updateNum);
	});
	plus_btn.forEach((btn) => {
		btn.addEventListener('click', updateNum);
	});

	hideBox();
	getOrderPage();
}
// 결제정보 랜더링
function getOrderPage() {
	const orderTotal = document.querySelector('#orderTotal')
	orderTotal.textContent = `${addCommas(getAllPrice()+3000)}원`;

	const orderProducts = document.querySelector('#productsTitle')
	orderProducts.textContent = getOrderProduct();

	const productsTotal = document.querySelector('#productsTotal')
	productsTotal.textContent = `${addCommas(getAllPrice())}원`;
}

// 불필요한 부분 삭제
function hideBox() {
	const checkboxAll = document.querySelectorAll('.check-btn-box')
	checkboxAll.forEach(check=>{
		check.classList.add('hide');
	})
	const orderBtn = document.querySelectorAll('.btn-item-buy')
	orderBtn.forEach((btn)=>{
		btn.remove()
	})
}

// 주문상품 목록 출력
function getOrderProduct() {
	const check_btn_all = document.querySelectorAll(
		'.check-btn-box input[type="checkbox"]',
	);
	let products = ''
	check_btn_all.forEach((check)=>{
		const cart = order.find(check.id)
		products += cart.product + ' / '
	})
	return products;
}

// 상품금액 출력
function getAllPrice() {
	const check_btn_all = document.querySelectorAll(
		'.check-btn-box input[type="checkbox"]',
	);
	let allPrice = 0;
	check_btn_all.forEach((check) => {
			const id = check.id;
			const cart = order.find(id);
			allPrice += cart.price * cart.num;
	});
	return allPrice;
}

// 수량 업다운
function updateNum(e) {
	const cartList = document.querySelector('.cart-seller-list');
	const upDown = e.target.textContent;
	const cart_item = e.target.closest('li');
	const id = cart_item.querySelector(
		'.check-btn-box input[type="checkbox"]',
	).id;
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
	console.log(order.value())
	localStorage.setItem('order', order.valueOf());
	cartList.remove();
	getOrder();
}

// 요청사항 selectbox
function selectWrite() {
	const options = requestSelectBox.selectedOptions;

	if (options[0].label != "직접 입력") {
		writeOption.style.display = "none";
		writeOptionSaveButton.style.display = "none";
		selectResult = options[0].label;
		console.log(selectResult);
	} else {
		writeOption.style.display = "block";
		writeOptionSaveButton.style.display = "block";
		console.log("직접입력을 선택했습니다.");
	}
}

function saveWriteOption(e) {
	e.preventDefault();
	if (writeOptionSaveButton.innerHTML =="저장") {
		selectResult = writeOption.value;
		console.log(selectResult);
		alert('요청사항이 저장되었습니다.');
		writeOption.disabled = true;
		writeOptionSaveButton.innerHTML = "수정";
	} else {
		writeOption.disabled = false;
		writeOptionSaveButton.innerHTML = "저장";		
	}
	
}

async function payment(e) {
	e.preventDefault();

	const order = JSON.parse(localStorage.getItem('order'))
	const options = requestSelectBox.selectedOptions
	const data = {
		nameInput: fullNameInput.value,
		addressInput: addressInput.value,phoneNumberInput: phoneNumberInput.value,
		// requestSelectBox: options[0].label,
		requestSelectBox: selectResult,
		orderProducts: order
	}
	console.log(data)
	const result = await Api.post('/api/orderadd',data)
	console.log(result)
}