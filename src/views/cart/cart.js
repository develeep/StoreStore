import { addTable } from '/cartTable.js';
import * as Api from '/api.js';
import { loginMatch } from '/loginMatch.js';

const cartTable = document.querySelector('.cart-lists tbody');
const delete_choice = document.querySelector('.delete_choice');
const deleteAll_btn = document.querySelector('.delete_all');
const delete_btn = document.querySelector('.delete_btn')
const table = document.querySelector('.container .cart-table');
const nullTable = document.querySelector('.null');
const order_btn = document.querySelector('.order-btn-line')

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
		table.classList.add('hide');
		nullTable.classList.remove('hide');
    nullTable.classList.add('null-table');
    delete_btn.classList.add('hide');
    order_btn.classList.add('hide')
    return;
	}
  table.classList.remove('hide');
  delete_btn.classList.remove('hide');
  order_btn.classList.remove('hide')
	cart.forEach(({ product, price, num }, index) => {
		const table = addTable(index + 1, product, price, num);
		cartTable.append(table);
	});
}

// 선택된 항목을 삭제하는 함수
async function delChoice() {
	const newCart = [];
	const checked = document.querySelectorAll('tbody input[name="cart_select"]');
	checked.forEach((check) => {
      if(check.checked){
			const parentTr = check.closest('tr');
			const index = parentTr.firstElementChild;
			parentTr.remove();
      }
      else {
			const parentTr = check.closest('tr');
			const product = parentTr.children[2].textContent;
			const price = parentTr.children[3].textContent;
			const num = parentTr.children[4].textContent;
			newCart.push({ product: product, price: price, num: num });
      parentTr.remove()
		}
    
	});
  if(newCart.length === checked.length){
    alert('제품을 선택 후 버튼을 클릭해주세요')
    getCart();
    return
  }
  if (newCart.length=== 0) {
    localStorage.removeItem('cart');
    alert('선택된 장바구니가 삭제되었습니다.');
    getCart();
    return
  }
	localStorage.setItem('cart', JSON.stringify(newCart));
  getCart();
	alert('선택된 장바구니가 삭제되었습니다.');
}

function deleteAll() {
	cartTable.remove();
	localStorage.removeItem('cart');
	alert('장바구니가 삭제되었습니다.');
  getCart()
}

