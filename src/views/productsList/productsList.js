import * as Api from '/api.js';
import { renderGnb } from '/renderGnb.js';
import { getElement, getElementAll, createElement } from '/useful-functions.js';

addAllElements();

addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
	getProducts();
}
// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {}

async function getProducts() {
	
	const items = await Api.get('/api/productswithcategory');
	const products = [...items];
	console.log(products);

	const beforeBox = getElement('.product-items-box');
	if (beforeBox) {
		beforeBox.remove();
	}

	const productItemBox = createElement('ul');
	productItemBox.classList.add('product-items-box');

	products.forEach(async(product) => {
		const item = renderProducts(product);
		productItemBox.append(item);
	});

	const productsBox = getElement('.products-box');
	productsBox.append(productItemBox);
}

function renderProducts(object) {
	const item = createElement('li');
	item.classList.add('product-item');

	const productId = createElement('p');
	const productName = createElement('p');
	const productCategory = createElement('p');
	const productPrice = createElement('p');
	const productAmount = createElement('p');
	const productSales = createElement('p');
	const productCompany = createElement('p');
	const updateDelBtnBox = createElement('div');

	productId.classList.add('product-id');
	productName.classList.add('product-name');
	productCategory.classList.add('product-category');
	productPrice.classList.add('product-price');
	productAmount.classList.add('product-amount');
	productSales.classList.add('product-sales');
	productCompany.classList.add('product-company');
	updateDelBtnBox.classList.add('update-del-btn-box');

	productId.textContent = object.productId;
	productName.textContent = object.name;
	productCategory.textContent = object.category.name;
	productPrice.textContent = object.price;
	productAmount.textContent = object.inventory;
	productSales.textContent = object.salesRate;
	productCompany.textContent = object.company;

	const updateBtn = createElement('button');
	const delBtn = createElement('button');
	updateBtn.classList.add('update-btn');
	delBtn.classList.add('del-btn');
	const updateIcon = createElement('i');
	const delIcon = createElement('i');
	updateIcon.classList.add('fas', 'fa-edit');
	delIcon.classList.add('fa', 'fa-trash');
	updateBtn.append(updateIcon);
	delBtn.append(delIcon);


	updateBtn.addEventListener('click',()=>{
		location.href = `/admin/productUpdate?productId=${object.productId}`
	})
	delBtn.addEventListener('click', async () => {
		try {
			const del = await Api.delete('/api/products', '', {
				productId: object.productId,
				imageKey:object.imageKey,
			});
			if (del.status === 'ok') {
				console.log(del)
				swal('삭제가 완료되었습니다.').then(() => {
					getProducts();
				});
			}
		} catch (err) {
			swal(err.message);
		}
	});

	updateDelBtnBox.append(updateBtn, delBtn);

	item.append(
		productId,
		productName,
		productCategory,
		productPrice,
		productAmount,
		productSales,
		productCompany,
		updateDelBtnBox,
	);
	return item;
}
