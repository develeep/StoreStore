import * as Api from '/api.js';

const toTopEl = document.getElementById('to-top');
const inputProduct = document.getElementById('inputProduct');
const subCategory = document.getElementById('s-category');
const title = document.getElementById('title');

let params = location.href.split('/');
params = params[params.length - 2];
console.log(params);
const getProductCategory = await Api.get(`/api/getProductCategory`, params);
console.log(getProductCategory);

makeCategory();

// 상단으로 가는 버튼
toTopEl.addEventListener('click', function () {
	gsap.to(window, 0.7, {
		scrollTo: 0,
	});
});

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
const categorys = await Api.get('/api/getcategorys');
console.log(categorys);

const findSubCategory = getProductCategory[0].category.name; //구두
for (const [key, value] of Object.entries(categorys)) {
	const found = value.indexOf(findSubCategory);
	if (found === 0) {
		title.innerHTML = `<h1>${key}</h1>`;
		for (let i = 0; i < value.length; i++) {
			subCategory.innerHTML += `<li>${value[i]}</li>`;
		}
	}
}