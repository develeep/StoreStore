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
        <button class="cancelOrderButton" name=${obj.orderId}>주문취소</button></div>
      </div>
  `,
		),
	);
  const cancelOrderButtons = getElementAll('.cancelOrderButton');
	var cancelButtonArray = [...cancelOrderButtons];
	cancelButtonArray.forEach((btn) =>
		btn.addEventListener('click', cancelOrder),
	);
}

async function cancelOrder() {
  console.log(this.name);
	const orders = await Api.delete(`/api/orders/${this.name}`);
	location.reload();
}