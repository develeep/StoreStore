import * as Api from '/api.js';

// /요소(element), input 혹은 상수
const toTopEl = document.getElementById('to-top');
const inputProduct = document.getElementById('inputProduct');

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {}

// 상단으로 가는 버튼
toTopEl.addEventListener('click', function () {
	gsap.to(window, 0.7, {
		scrollTo: 0,
	});
});

// 이미지슬라이드
new Swiper('.promotion .swiper-container', {
	autoplay: {
		delay: 5000, //5초
	},
	loop: true, // 반복 재생 여부
	slidesPerView: 3, // 한 번에 보여줄 슬라이드 개수
	spaceBetween: 0, // 슬라이드 사이 여백
	centeredSlides: true, // 1번 슬라이드가 가운데 보이기

	// pagination 기본은 bullet
	pagination: {
		el: '.promotion .swiper-pagination',
		clickable: true, // 페이지 네이션 버튼 클릭시 슬라이드 반응 여부
		type: 'bullets', // 버튼 모양 결정 "bullets", "fraction"
	},

	navigation: {
		prevEl: '.promotion .swiper-prev',
		nextEl: '.promotion .swiper-next',
	},
});

// 8개 제품 api 가져오기
const bestproducts = await Api.get('/api/bestproducts');
console.log(bestproducts);

for (let i = 0; i < bestproducts.length; i++) {
	const image = bestproducts[i].imageUrl;
	const seller = bestproducts[i].company;
	const productDescription = bestproducts[i].name;
	const price = bestproducts[i].price;
	const productId = bestproducts[i].productId;
	//원화 변경
	const priceKRW = price.toLocaleString('ko-KR');

	inputProduct.innerHTML += `<div onclick="localStorage.setItem('productId','${productId}'); 
	location.href = '/product-detail/${productDescription}';" class="product-item" id="product-item">
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
