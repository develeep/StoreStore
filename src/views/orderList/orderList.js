import { renderGnb } from '/renderGnb.js'
import * as Api from '/api.js';
import { getElement, getElementAll, addCommas } from '/useful-functions.js';

const orderTableTitle = getElement('.orderTableTitle');

addAllElements();
addAllEvents();

function addAllElements() {
  
}

function addAllEvents() {
  getOrder();
}
// 나중에 리팩토링
async function getOrder() {
  const orders = await Api.get('/api/allorders');
  console.log(orders);
  // - orderId, timeKor, buyer, product, priceSum, deliveryStatus
	// - 주문취소버튼 추가
  orders.forEach((obj) =>
		orderTableTitle.insertAdjacentHTML(
			'afterend',
			`<div class="orderTableRow">
        <div class="orderTableCell" id="orderNumber">${obj.orderId}</div>
        <div class="orderTableCell" id="orderDate">${obj.timeKor}</div>
        <div class="orderTableCell" id="orderBuyer">${obj.buyer.fullName}</div>
        <div class="orderTableCell" id="orderProduct">${obj.product}</div>
        <div class="orderTableCell" id="orderPriceSum">${addCommas(obj.priceSum)}원</div>
        <div class="orderTableCell" id="orderState">${obj.deliveryStatus}</div>
        <div class="orderTableCell">
          <div class="select">
            <select class="requestSelectBox" id=${obj.orderId}>
              <option value="0">배송준비중</option>
              <option value="1">배송중</option>
              <option value="2">배송완료</option>
            </select>
            <button class="changeOrderStateButton" name=${obj.orderId}>저장</button>
          </div>
        </div>
        <button class="cancelOrderButton" name=${obj.orderId}>주문취소</button></div>
      </div>
      `,
		),
	);
  const cancelOrderButtons = getElementAll('.cancelOrderButton');
	const cancelButtonArray = [...cancelOrderButtons];
	cancelButtonArray.forEach((btn) =>
		btn.addEventListener('click', cancelOrder),
	);
  const requestSelectBox = getElementAll('.requestSelectBox');
  const saveOrderStatusButtons = getElementAll('.changeOrderStateButton');
  const saveStatusButtonArray = [...saveOrderStatusButtons];
  saveStatusButtonArray.forEach((btn) => {
    btn.addEventListener('click', saveStatus);
  });
}

async function cancelOrder() {
  // button의 name을 orderId로 설정. 리팩토링 시 수정
  console.log(this.name);
	const orders = await Api.delete(`/api/orders/${this.name}`);
	location.reload();
}

function getChangeStatus(orderId) {
  const selectBox = document.querySelector(`#${orderId}`); // select 박스
  const selectValue = selectBox.selectedOptions;
  // console.log(selectValue[0].label);
  if (selectValue[0].label == "배송준비중") {
    return "배송준비중";
  }
  else if (selectValue[0].label == "배송중") {
    return "배송중";
  }
  return "배송완료";
}

async function saveStatus() {
  const status = getChangeStatus(this.name);
  console.log(status);
  // 배송상태(status)를 DB에 반영
  const saveObject = {
    orderId: this.name,
    deliveryStatus: status,
  }
  const orders = await Api.patch('/api/orders', '', saveObject);
  if (orders) {
    console.log('성공');
  }
}