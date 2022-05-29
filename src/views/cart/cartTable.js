import { addCommas,createElement } from '/useful-functions.js';

export function addTable(cartObject) {
	const cart = createElement('li');
	cart.classList.add('cart-item');

	const checkboxDiv = createElement('div');
	const checkbox = createElement('input');
	checkbox.type = 'checkbox';
	checkbox.id = cartObject.id;
	checkbox.checked = true;
	checkboxDiv.classList.add('check-btn-box', 'checkbox-btn');
	checkboxDiv.append(checkbox);

	const infoDiv = createElement('div');
	infoDiv.classList.add('item-info');

	const imageDiv = createElement('div');
	const productInfoDiv = createElement('div');
	const productName = createElement('p');
	const productPrice = createElement('p');
	const image = createElement('img');

	imageDiv.classList.add('product_img');
	image.src = cartObject.src;
	imageDiv.append(image);

	productInfoDiv.classList.add('product_info');
	productName.classList.add('product_name');
	productPrice.classList.add('product_price');
	productName.textContent = `${cartObject.product} / ${cartObject.id}`;
	productPrice.textContent = `${addCommas(cartObject.price)}원`;
	productInfoDiv.append(productName, productPrice);

	infoDiv.append(imageDiv, productInfoDiv);

	const optionDiv = createElement('div')
	const itemOption = createElement('div');
	const quantityBox = createElement('div');
	const minusBtn = createElement('div');
	const quantity = createElement('label');
	const inputNum = createElement('input');
	const plusBtn = createElement('div');

	optionDiv.classList.add('item-option-wrap')
	itemOption.classList.add('item-option');
	quantityBox.classList.add('btn-quanity-box');
	minusBtn.classList.add('num_minus_btn');
	minusBtn.textContent = '-';
	quantity.for = 'quantity';
	inputNum.type = 'text';
	inputNum.disabled = 'disabled';
	inputNum.classList.add('input_num');
	inputNum.value = cartObject.num;
	plusBtn.classList.add('num_plus_btn');
	plusBtn.textContent = '+';

	quantity.append(inputNum);
	quantityBox.append(minusBtn, quantity, plusBtn);
	itemOption.append(quantityBox);
	optionDiv.append(itemOption)

	const buyWrap = createElement('div')
	const itemBuy = createElement('div');
	const buyBox = createElement('div');
	const priceBox = createElement('div');
	const itemPrice = createElement('div');
	const buyBtn = createElement('button');

	buyWrap.classList.add('item-buy-wrap')
	itemBuy.classList.add('item-buy');
	buyBox.classList.add('btn-item-buy-box');
	priceBox.classList.add('item-price-box');
	itemPrice.classList.add('item-price');
	itemPrice.textContent=`${addCommas(cartObject.num * cartObject.price)}원`;
	buyBtn.classList.add('btn-item-buy');
	buyBtn.textContent = '주문하기';

	priceBox.append(itemPrice);
	buyBox.append(priceBox, buyBtn);
	itemBuy.append(buyBox);
	buyWrap.append(itemBuy)

	cart.append(checkboxDiv, infoDiv, optionDiv, buyWrap);
	return cart;
}

export function allPriceTable(allPrice) {
	const priceInfoBox = createElement('div')
	const info = createElement('strong')
	const price = createElement('p')
	
	priceInfoBox.classList.add('payment-price-info-box')
	info.textContent = '총 결제 금액'
	price.textContent = `${addCommas(allPrice)}원`

	priceInfoBox.append(info,price)

	return priceInfoBox
}