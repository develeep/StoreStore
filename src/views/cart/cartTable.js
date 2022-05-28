import { addCommas } from '/useful-functions.js';

export function addTable(src, product, price, num, id) {
	const cart = document.createElement('li');
	cart.classList.add('cart-item');

	const checkboxDiv = document.createElement('div');
	const checkbox = document.createElement('input');
	checkbox.type = 'checkbox';
	checkbox.id = id;
	checkbox.checked = true;
	checkboxDiv.classList.add('check-btn-box', 'checkbox-btn');
	checkboxDiv.append(checkbox);

	const infoDiv = document.createElement('div');
	infoDiv.classList.add('item-info');

	const imageDiv = document.createElement('div');
	const productInfoDiv = document.createElement('div');
	const productName = document.createElement('p');
	const productPrice = document.createElement('p');
	const image = document.createElement('img');

	imageDiv.classList.add('product_img');
	image.src = src;
	imageDiv.append(image);

	productInfoDiv.classList.add('product_info');
	productName.classList.add('product_name');
	productPrice.classList.add('product_price');
	productName.textContent = `${product} / ${id}`;
	productPrice.textContent = `${addCommas(price)}원`;
	productInfoDiv.append(productName, productPrice);

	infoDiv.append(imageDiv, productInfoDiv);

	const optionDiv = document.createElement('div')
	const itemOption = document.createElement('div');
	const quantityBox = document.createElement('div');
	const minusBtn = document.createElement('div');
	const quantity = document.createElement('label');
	const inputNum = document.createElement('input');
	const plusBtn = document.createElement('div');

	optionDiv.classList.add('item-option-wrap')
	itemOption.classList.add('item-option');
	quantityBox.classList.add('btn-quanity-box');
	minusBtn.classList.add('num_minus_btn');
	minusBtn.textContent = '-';
	quantity.for = 'quantity';
	inputNum.type = 'text';
	inputNum.disabled = 'disabled';
	inputNum.classList.add('input_num');
	inputNum.value = num;
	plusBtn.classList.add('num_plus_btn');
	plusBtn.textContent = '+';

	quantity.append(inputNum);
	quantityBox.append(minusBtn, quantity, plusBtn);
	itemOption.append(quantityBox);
	optionDiv.append(itemOption)

	const buyWrap = document.createElement('div')
	const itemBuy = document.createElement('div');
	const buyBox = document.createElement('div');
	const priceBox = document.createElement('div');
	const itemPrice = document.createElement('div');
	const buy_btn = document.createElement('button');

	buyWrap.classList.add('item-buy-wrap')
	itemBuy.classList.add('item-buy');
	buyBox.classList.add('btn-item-buy-box');
	priceBox.classList.add('item-price-box');
	itemPrice.classList.add('item-price');
	itemPrice.textContent=`${addCommas(num * price)}원`;
	buy_btn.classList.add('btn-item-buy');
	buy_btn.textContent = '주문하기';

	priceBox.append(itemPrice);
	buyBox.append(priceBox, buy_btn);
	itemBuy.append(buyBox);
	buyWrap.append(itemBuy)

	cart.append(checkboxDiv, infoDiv, optionDiv, buyWrap);
	return cart;
}

export function allPriceTable(allPrice) {
	const priceInfoBox = document.createElement('div')
	const info = document.createElement('strong')
	const price = document.createElement('p')
	
	priceInfoBox.classList.add('payment-price-info-box')
	info.textContent = '총 결제 금액'
	price.textContent = `${addCommas(allPrice)}원`

	priceInfoBox.append(info,price)

	return priceInfoBox
}