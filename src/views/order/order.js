import * as Api from '/api.js';
import { getElement, getElementAll, addCommas } from '/useful-functions.js';

const orderTableTitle = getElement('.orderTableTitle');

addAllElements();
addAllEvents();

function addAllElements() {}

function addAllEvents() {
	getOrder();
}

async function getOrder() {
	try {
		const orders = await Api.get('/api/orders');
		console.log(orders);

		orders.forEach((obj) =>
			orderTableTitle.insertAdjacentHTML(
				'afterend',
				`<div class="orderTableRow">
        <div class="orderTableCell" id="orderDate">${obj['timeKor']}</div>
        <div class="orderTableCell" id="orderNumber"><a href="/payment/${
					obj['orderId']
				}">${obj['orderId']}</a></div>
        <div class="orderTableCell" id="orderProduct">${obj['product']}</div>
        <div class="orderTableCell" id="orderPriceSum">${addCommas(
					obj['priceSum'],
				)}원</div>
        <div class="orderTableCell" id="orderState">${
					obj['deliveryStatus']
				}</div>
				<div class="buttons">
        <button class="detailShowButton" name=${
					obj['orderId']
				}>상세보기</button>
        <button class="cancelOrderButton" name=${
					obj['orderId']
				}>주문취소</button></div>
      </div>
  `,
			),
		);
		const cancelOrderButtons = getElementAll('.cancelOrderButton');
		var cancelButtonArray = [...cancelOrderButtons];
		cancelButtonArray.forEach((btn) =>
			btn.addEventListener('click', cancelOrder),
		);
		const detailProductButton = getElementAll('.detailShowButton');
		var detailButtonArray = [...detailProductButton];
		detailButtonArray.forEach((btn) => {
			btn.addEventListener('click', makeModalContent);
			btn.addEventListener('click', toggleModal);
		});
	} catch (err) {
		swal(err.message).then(() => {
			const url = location.href;
			const beforeURI = encodeURIComponent(url);
			location.href = `/login?beforeURI=${beforeURI}`;
		});
	}
}

async function cancelOrder() {
	console.log(this.name);
	const orders = await Api.delete(`/api/orders/${this.name}`);
	location.reload();
}

// modal 구현
const modal = getElement('.modal');
const modalBackground = getElement('.modalBackground');
const closeButton = getElement('.closeButton');

async function makeModalContent() {
	const order = await Api.get('/api/orders', this.name);
	console.log(order);
	const orderDate = getElement('.modalOrderDate');
	const orderNumber = getElement('.modalOrderNumber');
	const orderProduct = getElement('.modalOrderProduct');
	const orderPriceSum = getElement('.modalOrderPriceSum');
	const orderReqestMsg = getElement('.modalOrderReqestMsg');
	const orderState = getElement('.modalOrderState');
	const orderName = getElement('.modalOrderReceiver');
	const orderPhone = getElement('.modalOrderPhoneNumber');
	const orderAddress = getElement('.modalOrderAddress');
	orderDate.innerHTML = `${order.timeKor}`;
	orderNumber.innerHTML = `${order.orderId}`;
	orderProduct.innerHTML = `${order.product}`;
	orderPriceSum.innerHTML = `${order.priceSum}`;
	orderState.innerHTML = `${order.deliveryStatus}`;
	orderReqestMsg.innerHTML = `${order.requestMessage}`;
	orderName.innerHTML = `${order.receiver.name}`;
	orderPhone.innerHTML = `${order.receiver.phoneNumber}`;
	orderAddress.innerHTML = `${order.receiver.address}`;

}

// 상세보기 버튼과 modal창의 닫기 버튼 클릭 시 modal창
function toggleModal() {
	modal.classList.toggle('showModal');
	modalBackground.classList.toggle('modalBackgroundOn');
}

function windowOnClick(event) {
	if (event.target === modal) {
		toggleModal();
	}
}

closeButton.addEventListener('click', toggleModal);
window.addEventListener('click', windowOnClick);
