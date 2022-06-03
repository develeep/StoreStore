import * as Api from '/api.js';
import { renderGnb } from '/renderGnb.js';
import { getElement, addCommas } from '/useful-functions.js';

addAllEvents();
addAllElements();

function addAllElements() {
	getOrder();
}

function addAllEvents() {
	const homeBtn = getElement('.home-btn');
	homeBtn.addEventListener('click', goHome);
}
async function getOrder() {
	try {
		const params = location.href.split('/')[4];
		console.log(params);
		const order = await Api.get('/api/orders', params);
		console.log(order);
		renderOrdered(order);
		if (localStorage.getItem('order')) {
			delOldCart();
		}
	} catch (err) {
		alert(err.message);
	}
}
function delOldCart() {
	if (JSON.parse(localStorage.getItem('check'))) {
		const orders = JSON.parse(localStorage.getItem('order'));
		const carts = JSON.parse(localStorage.getItem('cart'));
		const cartsArr = [...carts];
		const newCarts = cartsArr.filter((cart) => {
			const ord = orders.filter((order) => cart.id === order.id);
			if (ord.length > 0) {
				console.log(ord);
				console.log(ord.length);
				return false;
			}
			if (ord.length === 0) {
				console.log(ord);
				console.log(ord.length);
				return true;
			}
			console.log(1);
		});
		console.log(newCarts);
		localStorage.setItem('cart', JSON.stringify(newCarts));
		localStorage.removeItem('order');
		localStorage.setItem('check', JSON.stringify(false));
	}
}

function goHome() {
	location.href = '/';
}
function renderOrdered(order) {
	const nameBox = getElement('.order-name');
	const adressBox = getElement('.order-adress');
	const phoneBox = getElement('.order-phone');
	const requestBox = getElement('.order-request');
	const productsBox = getElement('.order-products');
	const priceBox = getElement('.order-price');
	const statusBox = getElement('.order-status');
	const { receiver, requestMessage, product, priceSum, deliveryStatus } = order;

	nameBox.textContent = receiver.name;
	adressBox.textContent = receiver.address;
	phoneBox.textContent = receiver.phoneNumber;
	requestBox.textContent = requestMessage;
	productsBox.textContent = product;
	priceBox.textContent = addCommas(priceSum) + '원';
	statusBox.textContent = deliveryStatus;
}
