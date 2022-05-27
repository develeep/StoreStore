import { addCommas } from '/useful-functions.js';

export function addTable(src, product, price, num, id) {
	const cart = document.createElement('li');
	cart.classList.add('cart-item');

	const checkbox_div = document.createElement('div');
	const checkbox = document.createElement('input');
	checkbox.type = 'checkbox';
	checkbox.id = id;
	checkbox.checked = true;
	checkbox_div.classList.add('check-btn-box', 'checkbox-btn');
	checkbox_div.append(checkbox);

	const info_div = document.createElement('div');
	info_div.classList.add('item-info');

	const image_div = document.createElement('div');
	const product_info_div = document.createElement('div');
	const product_name = document.createElement('p');
	const product_price = document.createElement('p');
	const image = document.createElement('img');

	image_div.classList.add('product_img');
	image.src = src;
	image_div.append(image);

	product_info_div.classList.add('product_info');
	product_name.classList.add('product_name');
	product_price.classList.add('product_price');
	product_name.textContent = `${product} / ${id}`;
	product_price.textContent = `${addCommas(price)}원`;
	product_info_div.append(product_name, product_price);

	info_div.append(image_div, product_info_div);

	const option_div = document.createElement('div')
	const item_option = document.createElement('div');
	const quanity_box = document.createElement('div');
	const minus_btn = document.createElement('div');
	const quantity = document.createElement('label');
	const input_num = document.createElement('input');
	const plus_btn = document.createElement('div');

	option_div.classList.add('item-option-wrap')
	item_option.classList.add('item-option');
	quanity_box.classList.add('btn-quanity-box');
	minus_btn.classList.add('num_minus_btn');
	minus_btn.textContent = '-';
	quantity.for = 'quantity';
	input_num.type = 'text';
	input_num.disabled = 'disabled';
	input_num.classList.add('input_num');
	input_num.value = num;
	plus_btn.classList.add('num_plus_btn');
	plus_btn.textContent = '+';

	quantity.append(input_num);
	quanity_box.append(minus_btn, quantity, plus_btn);
	item_option.append(quanity_box);
	option_div.append(item_option)

	const buy_wrap = document.createElement('div')
	const item_buy = document.createElement('div');
	const buy_box = document.createElement('div');
	const price_box = document.createElement('div');
	const item_price = document.createElement('div');
	const buy_btn = document.createElement('button');

	buy_wrap.classList.add('item-buy-wrap')
	item_buy.classList.add('item-buy');
	buy_box.classList.add('btn-item-buy-box');
	price_box.classList.add('item-price-box');
	item_price.classList.add('item-price');
	item_price.textContent=`${addCommas(num * price)}원`;
	buy_btn.classList.add('btn-item-buy');
	buy_btn.textContent = '주문하기';

	price_box.append(item_price);
	buy_box.append(price_box, buy_btn);
	item_buy.append(buy_box);
	buy_wrap.append(item_buy)

	cart.append(checkbox_div, info_div, option_div, buy_wrap);
	return cart;
}

export function allPriceTable(allPrice) {
	const price_info_box = document.createElement('div')
	const info = document.createElement('strong')
	const price = document.createElement('p')
	
	price_info_box.classList.add('payment-price-info-box')
	info.textContent = '총 결제 금액'
	price.textContent = `${addCommas(allPrice)}원`

	price_info_box.append(info,price)

	return price_info_box
}