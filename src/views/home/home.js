import * as Api from '/api.js';

// /요소(element), input 혹은 상수
const toTopEl = document.getElementById('to-top');
const swiperWrapper = document.getElementById('swiper-wrapper');

const Categorylatestproduct = await Api.get('/api/Categorylatestproduct');
// console.log(Categorylatestproduct);

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

function makeCategory() {
	for (const [key, value] of Object.entries(Categorylatestproduct)) {
		const categoryName = key;
		const productImageUrl = value.imageUrl;
		const productId = value.productId;

		swiperWrapper.innerHTML += `<div class="swiper-slide">
		<div class="image-box">
			<img
				src="${productImageUrl}"
				alt="${categoryName}"
				onclick="localStorage.setItem('productId','${productId}'); 
				location.href = '/product-detail/${productId}';"
			/>
		</div>
		<a href="/products/${categoryName}" class="btn">${categoryName}</a>
	</div>`;
	}
}

// 상단으로 가는 버튼
function toTopEvent() {
	window.scrollTo({
		top: 0,
		behavior: 'smooth',
	});
}

// 이미지슬라이드
const swiper = new Swiper('.mySwiper', {
	slidesPerView: 2,
	spaceBetween: 30,
	loop: true,
	pagination: {
		el: '.swiper-pagination',
		clickable: true,
	},
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
	breakpoints: {
		//반응형 width
		1020: { slidesPerView: 4 },
	},
});
