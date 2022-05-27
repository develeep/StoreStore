import { addTable } from '/cartTable.js';
import * as Api from '/api.js';
import { loginMatch } from '/loginMatch.js';

const delete_choice = document.querySelector('.delete_choice');
const deleteAll_btn = document.querySelector('.delete_all');
const delete_btn = document.querySelector('.delete_btn');
const cart_box = document.querySelector('.container .cart-product-box');
const nullTable = document.querySelector('.null');
const order_btn = document.querySelector('.order-btn-line');
const check_all = document.querySelector('#check_all');

addAllElements();

addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
	loginMatch();
	getCart();
}
// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
	delete_choice.addEventListener('click', delChoice);
	deleteAll_btn.addEventListener('click', deleteAll);
}

// 페이지 시작시 카트 정보를 가져와서 나타네는 함수
function getCart() {
	const cart = JSON.parse(localStorage.getItem('cart'));
	if (!cart) {
		// 장바구니가 없을시 장바구니를 추가해주라는 화면이 뜸
		cart_box.classList.add('hide');
		nullTable.classList.remove('hide');
		nullTable.classList.add('null-table');
		delete_btn.classList.add('hide');
		order_btn.classList.add('hide');
		return;
	}
	// 장바구니가 있을시 장바구니 화면 띄움
	cart_box.classList.remove('hide');
	delete_btn.classList.remove('hide');
	order_btn.classList.remove('hide');
	const cartList = document.createElement('ul');
	cartList.classList.add('cart-seller-list');
	cart.forEach(({ src, product, price, num, id }) => {
		const cart_item = addTable(src, product, price, num, id);
		cartList.append(cart_item);
		cart_box.append(cartList);
	});
	check_all.addEventListener('click', checkAll);
	check_event();
}

function checkAll() {
	const check_btn_all = document.querySelectorAll(
		'.check-btn-box input[type="checkbox"]',
	);
	check_btn_all.forEach((check) => {
		check.checked = check_all.checked;
	});
}

function check_event() {
	const check_btn_all = document.querySelectorAll(
		'.check-btn-box input[type="checkbox"]',
	);
	check_btn_all.forEach((check) => {
		check.addEventListener('change', () => {
			if (check.checked == false) {
				check_all.checked = false;
			}
		});
	});
}

// 선택된 항목을 삭제하는 함수
function delChoice() {
	const check_btn_all = document.querySelectorAll(
		'.check-btn-box input[type="checkbox"]',
	);
	const cartList = document.querySelector('.cart-seller-list');
	const carts = JSON.parse(localStorage.getItem('cart'));
	const newCart = new Cart();
	carts.forEach((cart) => {
		newCart.add(cart);
	});
	console.log(carts);
	check_btn_all.forEach((check) => {
		if (check.checked) {
			if (newCart.has(check.id)) {
				newCart.delete(check.id);
			}
		}
	});
  cartList.remove();
  alert('선택된 물품이 삭제외었습니다.')
  if(JSON.parse(newCart.valueOf()).length === 0){
    localStorage.removeItem('cart')
    getCart();
  }
	else{
    localStorage.setItem('cart', newCart.valueOf());

    getCart();
  }
}

function deleteAll() {
  const cartList = document.querySelector('.cart-seller-list');
	cartList.remove();
	localStorage.removeItem('cart');
	alert('장바구니가 삭제되었습니다.');
	getCart();
}

class Cart {
	cart;
	keys;
	constructor() {
		this.cart = {}; // 상품이 들어간다.
		this.keys = new Set(); // 상품의 key 가 들어간다.
	}

	add(item) {
		if (this.has(item.id)) {
			return;
		}
		this.cart[item.id] = item;
		this.keys.add(item.id);
	}

	delete(id) {
		this.keys.delete(id);
		delete this.cart[id];
	}

	has(id) {
		return this.keys.has(id);
	}

	valueOf() {
		// [{}, {}, ...] 형태로 만들어서 반환하거나
		// JSON.stringify 형태로 바꿔서 반환하기

		// { 'a1': 10, 'b2': 100 }
		const values = Object.values(this.cart);

		// return values;

		// OR

		return JSON.stringify(values);
	}
}

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
cart.add(item1);
cart.add(item2);
cart.add(item3);
console.log(cart.valueOf());
localStorage.setItem('cart',cart.valueOf())
