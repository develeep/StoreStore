// 아래는 현재 home.html 페이지에서 쓰이는 코드는 아닙니다.
// 다만, 앞으로 ~.js 파일을 작성할 때 아래의 코드 구조를 참조할 수 있도록,
// 코드 예시를 남겨 두었습니다.
import { loginMatch } from '/loginMatch.js';
import * as Api from '/api.js';
import { randomId } from '/useful-functions.js';

// // 요소(element), input 혹은 상수
const toTopEl = document.querySelector('#to-top');

toTopEl.addEventListener('click', function () {
	gsap.to(window, 0.7, {
		scrollTo: 0,
	});
});

console.log(loginMatch);
addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
	loginMatch();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {}

async function getDataFromApi() {
	// 예시 URI입니다. 현재 주어진 프로젝트 코드에는 없는 URI입니다.
	const data = await Api.get('/api/user/data');
	const random = randomId();

	console.log({ data });
	console.log({ random });
}

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
