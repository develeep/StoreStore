import * as Api from '/api.js';
import { renderGnb } from '/renderGnb.js';
import { getElement, getElementAll } from '/useful-functions.js';

addAllEvents();
addAllElements();

function addAllElements() {
	renderGnb();
  getOrder();
}

function addAllEvents() {
  const homeBtn = getElement('.home-btn')
  homeBtn.addEventListener('click',goHome)
}
async function getOrder(){
  const params = location.href.split('/')[4]
  console.log(params)
  const order = await Api.get('/api/orders',params)
  console.log(order)
  renderOrdered(order)
  
}
function goHome() {
  location.href = '/'
}
function renderOrdered(order){
  const nameBox = getElement('.order-name')
  const adressBox = getElement('.order-adress')
  const phoneBox = getElement('.order-phone')
  const requestBox = getElement('.order-request')
  const productsBox = getElement('.order-products')
  const priceBox = getElement('.order-price')
  const statusBox = getElement('.order-status')
  const {receiver,requestMessage,product,priceSum,deliveryStatus} = order

  nameBox.textContent = receiver.name
  adressBox.textContent = receiver.address
  phoneBox.textContent = receiver.phoneNumber
  requestBox.textContent = requestMessage
  productsBox.textContent = product
  priceBox.textContent = priceSum
  statusBox.textContent = deliveryStatus

}