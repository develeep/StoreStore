import * as Api from '/api.js';

const inputProduct = document.getElementById('inputProduct');
const currentPage = document.getElementById('currentPage');
const rankedproducts = document.getElementById('rankedproducts');

const getCategories = await Api.get('/api/categories');

let params = location.href.split('/');
params = params[params.length - 2];
// console.log(params);
const getProductCategory = await Api.get(`/api/productCategory`, params);
const paramsKR = decodeURIComponent(params);

addAllElements();

async function addAllElements() {
	makeCategory();
	makeCurrentPage();
}

function makeCategory() {
	if (getProductCategory.length === 0) {
		rankedproducts.innerHTML += `<div class="nullcategory" id="nullcategory">등록된 상품이 없습니다.</div>`;
	} else {
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
		<div class="image-box">
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
