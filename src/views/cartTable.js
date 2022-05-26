export function addTable(index, product, price, num, id) {
	const tr = document.createElement('tr');
	tr.className = 'cart-list';

	const td_index = document.createElement('td');
	const td_checkbox = document.createElement('td');
	const td_product = document.createElement('td');
	const td_price = document.createElement('td');
	const td_num = document.createElement('td');
	const td_allPrice = document.createElement('td');
	const td_delBtn = document.createElement('td');
	const td_id = document.createElement('td');
	const checkbox = document.createElement('input');
	const order_btn = document.createElement('a');

	td_index.textContent = index;

	checkbox.type = 'checkbox';
	checkbox.name = 'cart_select';
	checkbox.checked = true;
	td_checkbox.append(checkbox);

	td_product.textContent = product;

	td_price.textContent = price;

	td_num.textContent = num;

	td_allPrice.textContent = parseInt(price) * parseInt(num);

	order_btn.href = '#';
	order_btn.className = 'order_btn';
	order_btn.textContent = '제품 삭제';
	td_delBtn.append(order_btn);

	td_id.textContent = id;

	tr.append(
		td_index,
		td_checkbox,
		td_product,
		td_price,
		td_num,
		td_allPrice,
		td_delBtn,
		td_id,
	);
	return tr;
}
