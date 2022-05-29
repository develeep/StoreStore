import * as Api from '/api.js';

const toTopEl = document.getElementById('to-top');
const inputProduct = document.getElementById('inputProduct');
const subCategory = document.getElementById('s-category');

let params = location.href.split('/');
params = params[params.length - 2];
// console.log(params);
const getProductCategory = await Api.get(`/api/getProductCategory`, params);

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
	makeCategory();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
	toTopEl.addEventListener('click', toTopEvent);
}

// 상단으로 가는 버튼
function toTopEvent() {
	window.scrollTo({
		top: 0,
		behavior: 'smooth',
	});
}

function makeCategory() {
	for (let i = 0; i < getProductCategory.length; i++) {
		const image = getProductCategory[i].imageUrl;
		const seller = getProductCategory[i].company;
		const productDescription = getProductCategory[i].name;
		const price = getProductCategory[i].price;
		const productId = getProductCategory[i].productId;
		//원화 변경
		const priceKRW = price.toLocaleString('ko-KR');

		// onclick = localStorage.setItem('productId',productId); location.href = '/product-detail'
		inputProduct.innerHTML += `<div onclick="localStorage.setItem('productId','${productId}'); 
		location.href = '/product-detail/${productId}';" class="product-item" id="product-item">
	<div>
		<img src="${image}" alt="${productDescription}" id="productImage">
	</div>
	<div class="description">
		<div class="detail">
			<div id="seller">${seller}</div>
			<div id="productDescription">${productDescription}</div>
		</div>
	<div class="price">
		<div id="productPrice">${priceKRW}원</div>
	</div>
	</div>
	</div>`;
	}
}

// 카테고리 api 가져오기
const categories = await Api.get('/api/getcategorys');

const findSubCategory = getProductCategory[0].category.name; //구두

// 서브 카테고리
for (const [key, value] of Object.entries(categories)) {
	const found = value.indexOf(findSubCategory);
	if (found === 0) {
		subCategory.innerHTML = `<h1 id="subCategoryTitle">${key}</h1>`;
		for (let i = 0; i < value.length; i++) {
			subCategory.innerHTML += `<li><a href="/products/${value[i]}">${value[i]}</a></li>`;
		}
	}
}

// 현재페이지 카테고리에 .current class 추가
const categoryLi = document.querySelectorAll('.main-Category-li');
const aTags = document.querySelectorAll('.aTag');
const title = document.getElementById('subCategoryTitle');

for (let i = 0; i < categoryLi.length; i++) {
	const categoryLiText = categoryLi[i].innerText;
	if (categoryLiText === title.innerText) {
		aTags[i].classList.add('current');
	}
}
