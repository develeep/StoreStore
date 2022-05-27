import { addTable,allPriceTable } from './cartTable.js';
import * as Api from '/api.js';
import { loginMatch } from '/loginMatch.js';
import { Cart } from '/CartClass.js';

const newCart = new Cart();

addAllElements();

addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
	loginMatch();
	getCart();
}
// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
	const delete_choice = document.querySelector('.delete_choice');
	const deleteAll_btn = document.querySelector('.delete_all');
	delete_choice.addEventListener('click', delChoice);
	deleteAll_btn.addEventListener('click', deleteAll);
}

// 페이지 시작 or cart 변화 시 카트 정보를 가져와	나타내는 함수
function getCart() {
	const cart = JSON.parse(localStorage.getItem('cart'));
	const delete_btn = document.querySelector('.delete_btn');
	const cart_box = document.querySelector('.container .cart-product-box');
	const nullTable = document.querySelector('.null');
	const order_btn = document.querySelector('.order-btn-line');
  const priceInfo = document.querySelector('.payment-price-info')

	if (!cart) {
		// 장바구니가 없을시 장바구니를 추가해주라는 화면이 뜸
		cart_box.classList.add('hide');
		nullTable.classList.remove('hide');
		nullTable.classList.add('null-table');
		delete_btn.classList.add('hide');
		order_btn.classList.add('hide');
    priceInfo.classList.add('hide')
		return;
	}
	// newCart에 아이템 추가(변경사항 있을시)
	newCart.getBefore();

	// 장바구니가 있을시 장바구니 화면 띄움
	cart_box.classList.remove('hide');
	delete_btn.classList.remove('hide');
	order_btn.classList.remove('hide');
  priceInfo.classList.remove('hide')

  // 장바구니 목록 생성
	const cartList = document.createElement('ul');
	cartList.classList.add('cart-seller-list');

	cart.forEach(({ src, product, price, num, id }) => {
		const cart_item = addTable(src, product, price, num, id);
		cartList.append(cart_item);
		cart_box.append(cartList);
	});

  // 총 합 가격 생성
  addAllPrice();

	getEvent();
}


// 최초 시작시 요소 불러온 후 이벤트 설정
function getEvent() {
  const minus_btn = document.querySelectorAll('.num_minus_btn');
	const plus_btn = document.querySelectorAll('.num_plus_btn');
	const check_all = document.querySelector('#check_all');
  
	check_all.addEventListener('click', checkAll);
	check_event();
	minus_btn.forEach((btn) => {
    btn.addEventListener('click', updateNum);
	});
	plus_btn.forEach((btn) => {
    btn.addEventListener('click', updateNum);
	});
  
}

// 총합 가격 테이블 생성 함수
function addAllPrice(){
  const container = document.querySelector('.container');
  const priceInfo = document.querySelector('.payment-price-info')
  const allPrice = getAllPrice();
  const payment = allPriceTable(allPrice);

  if(priceInfo.childElementCount != 0){
    priceInfo.querySelector('.payment-price-info-box').remove();
  }

  priceInfo.append(payment);
}

// 체크된 항목 가격 불러오기 함수
function getAllPrice() {
  const check_btn_all = document.querySelectorAll(
    '.check-btn-box input[type="checkbox"]',
  );
  const cartList = document.querySelector('.cart-seller-list');
  let allPrice = 0;

	check_btn_all.forEach((check) => {
		if (check.checked) {
	    const id = check.id;
      const cart = newCart.find(id)
      allPrice += cart.price * cart.num
		}
	});
  return allPrice;
}

// 전체 체크 클릭시 체크박스들 전체 체크하는 함수
function checkAll() {
	const check_all = document.querySelector('#check_all');
	const check_btn_all = document.querySelectorAll(
		'.check-btn-box input[type="checkbox"]',
	);
	check_btn_all.forEach((check) => {
		check.checked = check_all.checked;
	});
}

// 체크박스 전체 선택 상태에서 만약 하나라도 체크박스가 체크가 풀리면 전체 체크 체크박스도 풀리는 함수
function check_event() {
	const check_all = document.querySelector('#check_all');
	const check_btn_all = document.querySelectorAll(
		'.check-btn-box input[type="checkbox"]',
	);
	check_btn_all.forEach((check) => {
		check.addEventListener('change', () => {
			if (check.checked == false) {
				check_all.checked = false;
			}
      addAllPrice()
		});
	});
}

// 선택된 항목을 삭제하는 함수
function delChoice() {
  let checking = false;
	const check_btn_all = document.querySelectorAll(
		'.check-btn-box input[type="checkbox"]',
	);
	const cartList = document.querySelector('.cart-seller-list');
	check_btn_all.forEach((check) => {
		if (check.checked) {
			if (newCart.has(check.id)) {
				newCart.delete(check.id);
			}
      checking = true;
		}
	});
  if(!checking){
    alert('물품을 선택해 주세요.')
    return
  }
	cartList.remove();
	alert('선택된 물품이 삭제외었습니다.');

	if (JSON.parse(newCart.valueOf()).length === 0) {
		localStorage.removeItem('cart');
		getCart();
	} else {
		localStorage.setItem('cart', newCart.valueOf());
		getCart();
	}
}

// 전체 항목 삭제 함수
function deleteAll() {
	const cartList = document.querySelector('.cart-seller-list');
	cartList.remove();
	localStorage.removeItem('cart');
	alert('장바구니가 삭제되었습니다.');
	getCart();
}

// +,- 버튼에 따라 구매 수량이 변하는 함수
function updateNum(e) {
	const cartList = document.querySelector('.cart-seller-list');
	const upDown = e.target.textContent;
	const cart_item = e.target.closest('li');
	const id = cart_item.querySelector('.check-btn-box input[type="checkbox"]').id;
	const item = newCart.find(id);

	if (upDown == '-') {
		if (item.num === 1) {
			return;
		}
		item.num -= 1;
	} else if (upDown == '+') {
		item.num += 1;
	}

	newCart.update(item);
	localStorage.setItem('cart', newCart.valueOf());
	cartList.remove();
	getCart();
}

// 임시 카트 데이터 생성 함수
createExamData();

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
