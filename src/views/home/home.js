import * as Api from '/api.js';

// /요소(element), input 혹은 상수
const toTopEl = document.getElementById('to-top');

const Categorylatestproduct = await Api.get('/api/Categorylatestproduct');
console.log(Categorylatestproduct);

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

// 이미지슬라이드
const swiper = new Swiper('.mySwiper', {
	slidesPerView: 4,
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
});
