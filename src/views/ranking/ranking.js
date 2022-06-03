import * as Api from '/api.js';
import {
	getElement,
	getElementAll,
	createElement,
	addCommas,
} from '/useful-functions.js';

const inputProduct = document.getElementById('inputProduct');
let limit = 0;

addAllElements();

async function addAllElements() {
	makeRank();
}

const intersectionoObserver = new IntersectionObserver(
	async (entries) => {
		if (entries.some((entry) => entry.intersectionRatio > 0)) {
			await makeRank();
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

// 상단으로 가는 버튼
const toTopEl = document.getElementById('to-top');
toTopEl.addEventListener('click', function () {
	window.scrollTo({
		top: 0,
		behavior: 'smooth',
	});
});

function delBeforeLoading() {
	const loadingBoxBefore = getElement('#loading-box');
	if (limit < 1) {
		loadingBoxBefore.remove();
	}
}
async function getProducts(limit) {
	return await Api.getItem(`/api/rankednextproducts?page=${limit}`);
}

async function makeRank() {
	delBeforeLoading();
	const getProductsList = await getProducts(limit++);
	const getProductCategory = [...getProductsList];

	if (getProductCategory.length > 0) {
		const inputProductBox = createElement('div');
		inputProductBox.classList.add('inputProduct', 'productBox', `box${limit}`);

		getProductCategory.forEach((product, index) => {
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
			inputProduct.append(renderNoneCategory());
			`	`;
		}
	}
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

function observing(limit) {
	const product = getElement(`.box${limit}`);
	testObserve.observe(product);
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
