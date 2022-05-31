import { renderGnb } from '/renderGnb.js'
import * as Api from '/api.js';
import { getElement, getElementAll } from '/useful-functions.js';

const orderTableTitle = getElement('.orderTableTitle');

addAllElements();

function addAllElements() {
	renderGnb();
  getOrder();
}

async function getOrder() {
  const orders = await Api.get('/api/orders');
  console.log(orders);
  
  orders.forEach((obj) =>
    orderTableTitle.insertAdjacentHTML('afterend', 
    `<div class="orderTableRow">
        <div class="orderTableCell" id="orderDate">${obj["timeKor"]}</div>
        <div class="orderTableCell" id="orderInfo"><a href="/payment/${obj["orderId"]}">${obj["orderId"]}</a></div>
        <div class="orderTableCell" id="orderProduct"><a href="/payment/${obj["orderId"]}">${obj["product"]}</a></div>
        <div class="orderTableCell" id="orderPriceSum">${obj["priceSum"]}원</div>
        <div class="orderTableCell" id="orderState">${obj["deliveryStatus"]}</div>
        <button class="cancelOrderButton" name=${obj["orderId"]}>주문취소</button></div>
      </div>
  `)
  )
  const cancelOrderButtons = getElementAll('.cancelOrderButton');
  var buttonArray = [...cancelOrderButtons];
  buttonArray.forEach((btn) => btn.addEventListener("click", cancelOrder));
  console.log(buttonArray);
}

async function cancelOrder() {
  // 버튼 되면 name과 같은 주문번호 데이터 삭제하는 코드 추가
  console.log(this.name);
  const orders = await Api.delete(`/api/orders/${this.name}`);
  location.reload();
}