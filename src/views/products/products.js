import * as Api from '/api.js';

const toTopEl = document.getElementById('to-top');
const inputProduct = document.getElementById('inputProduct');
const subCategory = document.getElementById('s-category');
const rankedproducts = document.getElementById('rankedproducts');

let params = location.href.split('/');
params = params[params.length - 2];
// console.log(params);
const getProductCategory = await Api.get(`/api/getProductCategory`, params);

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
	makeCategory();
	currentPageMake();
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

if (getProductCategory.length === 0) {
	rankedproducts.innerHTML = `<div class="no_data">등록된 상품이 없습니다.</div>`;
} else {
	// 서브 카테고리
	for (const [key, value] of Object.entries(categories)) {
		const findSubCategory = getProductCategory[0].category.name; //구두
		const found = value.indexOf(findSubCategory);
		if (found === 0) {
			subCategory.innerHTML = `<h1 id="subCategoryTitle">${key}</h1>
			<li class="sub-Category-li"><a href="/products/${key}" class="aTagSub">All</a></li>`;
			for (let i = 0; i < value.length; i++) {
				subCategory.innerHTML += `<li class="sub-Category-li"><a href="/products/${value[i]}" class="aTagSub">${value[i]}</a></li>`;
			}
			break;
		} else if (found >= 0) {
			subCategory.innerHTML = `<h1 id="subCategoryTitle">${key}</h1>
			<li class="sub-Category-li"><a href="/products/${key}" class="aTagSub">All</a></li>`;
			for (let i = 0; i < value.length; i++) {
				subCategory.innerHTML += `<li class="sub-Category-li"><a href="/products/${value[i]}" class="aTagSub">${value[i]}</a></li>`;
			}
		}
	}
}

// 현재페이지 카테고리에 .current class 추가
const categoryLi = document.querySelectorAll('.main-Category-li');
const subCategoryLi = document.querySelectorAll('.sub-Category-li');
const aTagsMain = document.querySelectorAll('.aTagMain');
const aTagsSub = document.querySelectorAll('.aTagSub');
const title = document.getElementById('subCategoryTitle');

// 메인카테고리 current
for (let i = 0; i < categoryLi.length; i++) {
	const mainCategoryLiText = categoryLi[i].innerText;
	if (mainCategoryLiText === title.innerText) {
		aTagsMain[i].classList.add('current');
	}
}

//서브카테고리 current
for (let i = 0; i < subCategoryLi.length; i++) {
	const subCategoryLiText = subCategoryLi[i].innerText;

	//상품들의 타입이 같은지 확인
	const arr = [];
	getProductCategory.forEach((el) => {
		const type = el.category.name;
		arr.push(type);
	});
	const sameCategory = arr.every((el) => el == arr[0]);

	if (!sameCategory) {
		aTagsSub[i].classList.add('current');
		break;
	} else if (subCategoryLiText === getProductCategory[0].category.name) {
		aTagsSub[i].classList.add('current');
	}
}

const current = document.querySelectorAll('.current');
const currentPage = document.getElementById('currentPage');
const mainCategoryName = current[0].innerText;
const subCategoryName = current[1].innerText;

currentPage.innerHTML += `<h3>${mainCategoryName} > ${subCategoryName}</h3>`;
