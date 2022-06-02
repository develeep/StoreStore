import * as Api from '/api.js';
import {
	getElement,
	getElementAll,
	createElement,
	addCommas,
} from '/useful-functions.js';

const inputProduct = getElement('#inputProduct');
const currentPage = getElement('#currentPage');

const getCategories = await Api.get('/api/categories');

const intersectionoObserver = new IntersectionObserver(
	async (entries) => {
		if (entries.some((entry) => entry.intersectionRatio > 0)) {
			await makeCategory();
			entries[0].target.remove();
			const loadingBox = getElement('#loading-box');
			loadingBox.remove();
		}
	},
	{
		rootMargin: '50px',
	},
);

const testObserve = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry, index) => {
			entry.target.style.opacity = (entry.intersectionRatio * 10).toFixed(2);
			if (entry.isIntersecting) {
				entry.target.style.visibility = 'visible';
			} else {
				entry.target.style.visibility = 'hidden';
			}
		});
	},
	{
		threshold: [...new Array(1000).fill(0).map((_, i) => i * 0.001), 1],
		rootMargin: '-150px 0px -30px 0px',
		// threshold:0
	},
);

let limit = 0;

let params = location.href.split('/');
params = params[params.length - 2];
const paramsKR = decodeURIComponent(params);

addAllElements();

async function addAllElements() {
	makeCurrentPage();
	await makeCategory();
}

async function getProducts(limit) {
	const products = await Api.get(
		`/api/categorynext8products`,
		`${paramsKR}?page=${limit}`,
	);
	return [...products];
}

function delBeforeLoading() {
	const loadingBoxBefore = getElement('#loading-box');
	if (limit < 1) {
		loadingBoxBefore.remove();
	}
}

async function makeCategory() {
	delBeforeLoading();
	console.log(limit);

	const Products = await getProducts(limit++);

	if (Products.length > 0) {
		const inputProductBox = createElement('div');
		inputProductBox.classList.add('inputProduct', 'productBox', `box${limit}`);

		Products.forEach((product, index) => {
			const item = renderProductItem(product);
			inputProductBox.append(item);
		});
		const scrollDiv = createElement('div');

		const lodingBox = renderLoadingBox();

		inputProduct.append(inputProductBox, scrollDiv, lodingBox);

		observing(limit);
		intersectionoObserver.observe(scrollDiv);
	} else {
		const productBoxFind = getElement('.productBox');
		if (!productBoxFind) {
			inputProduct.append(renderNoneCategory());`	`
		}
	}
}

function observing(limit) {
	console.log('observing');
	const product = getElement(`.box${limit}`);
	testObserve.observe(product);
}

function renderLoadingBox() {
	const lodingBox = createElement('div');
	lodingBox.id = 'loading-box';
	const loding = createElement('div');
	loding.classList.add('lds-ring');
	const div = createElement('div');
	loding.append(div, div, div, div);
	lodingBox.append(loding);
	return lodingBox;
}

function renderNoneCategory() {
	const nullBox = createElement('div');
	nullBox.classList.add('nullcategory');
	nullBox.id = 'nullcategory';
	nullBox.textContent = '등록된 상품이 없습니다.';
	return nullBox;
}

function renderProductItem(product) {
	const productItem = createElement('div');
	productItem.classList.add('product-item');
	productItem.id = 'product-item';

	const imageBox = createElement('div');
	const img = createElement('img');
	imageBox.classList.add('image-box');
	img.id = 'productImage';
	img.alt = product.name;
	img.src = product.imageUrl;
	imageBox.append(img);

	const descriptionBox = createElement('div');
	descriptionBox.classList.add('description');

	const detailBox = createElement('div');
	detailBox.classList.add('detail');

	const seller = createElement('div');
	seller.id = 'seller';
	seller.textContent = product.company;
	const productDescription = createElement('div');
	productDescription.classList.add('productDescription');
	productDescription.textContent = product.name;
	detailBox.append(seller, productDescription);

	const priceBox = createElement('div');
	priceBox.classList.add('price');

	const price = createElement('div');
	price.id = 'productPrice';
	price.textContent = `${addCommas(product.price)}원`;
	priceBox.append(price);

	productItem.append;

	descriptionBox.append(detailBox, priceBox);
	productItem.append(imageBox, descriptionBox);

	productItem.addEventListener('click', () => {
		localStorage.setItem('productId', product.productId);
		location.href = `/product-detail/${product.productId}`;
	});

	return productItem;
}

function makeCurrentPage() {
	//현재페이지 경로
	let arr = [];
	Object.entries(getCategories).forEach(([key, value]) => {
		const findValue = value.find((e) => e === paramsKR);
		arr.push(findValue);
	});
	const currentIndex = arr.indexOf(paramsKR);
	const topCategory = Object.keys(getCategories)[currentIndex];
	// console.log(`${paramsKR}의 index 값은 ${currentIndex}번째`);
	if (topCategory !== undefined) {
		currentPage.innerHTML += `<a href="/products/${topCategory}" class="topCategory">${topCategory} > </a>
		<a href="/products/${paramsKR}" class="subCategory">${paramsKR}</a>`;
	} else {
		currentPage.innerHTML += `<a href="/products/${paramsKR}" class="topCategory" style="font-weight:700;">${paramsKR}</a>`;
	}
}
