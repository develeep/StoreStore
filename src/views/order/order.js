import { renderGnb } from '/renderGnb.js'
import * as Api from '/api.js';

const orderInfoButton = document.querySelector('#orderInfoButton');
const cancelOrderButton = document.querySelector('#cancelOrderButton');

addAllEvents();
addAllElements();

function addAllElements() {
	renderGnb();
  getOrder();
}

function addAllEvents() {
  orderInfoButton.addEventListener("click", orderInfo);
  cancelOrderButton.addEventListener("click", cancelOrder);

}

async function getOrder(){
  // const params = location.href.split('/')[4]
  // console.log(params)
  // const order = await Api.get('/api/orders',params)
  // console.log(order)
  
}

function chatFn() {
  var chatWidth = 450;
  var chatHeight = 655;
  var chatLeft = 90;
  var chatTop = 100;
  // xPos = (document.body.offsetWidth) - w; // 오른쪽 정렬
  // xPos += window.screenLeft; // 듀얼 모니터일 때
  // var yPos = (document.body.offsetHeight/2) - (h/2);
  window.open('chat', 'a', `width = ${chatWidth}px, height = ${chatHeight}px,left = ${chatLeft}%,top = ${chatTop}`);
}

async function orderInfo() {
  //주문 조회 상세 페이지 창 작게 띄움
  // const result = await Api.post('/api/orderadd',data)
  // console.log(result);
  // location.href = `/payment/${result.orderId}`;
  await chatFn();
}

function cancelOrder() {

}