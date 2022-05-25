// 아래는 현재 home.html 페이지에서 쓰이는 코드는 아닙니다.
// 다만, 앞으로 ~.js 파일을 작성할 때 아래의 코드 구조를 참조할 수 있도록,
// 코드 예시를 남겨 두었습니다.

import * as Api from '/api.js';
import { randomId } from '/useful-functions.js';

// 요소(element), input 혹은 상수
const loginBtn = document.querySelector('#login');
const registerBtn = document.querySelector('#register');
const navBar = document.querySelector('#navbar');

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
	loginMatch();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {}

function loginMatch() {
	const token = localStorage.getItem('token');
	if (token) {
		const logout = createA('/', '로그아웃');
		const myPage = createA('/userInfo', '마이페이지');
		logout.addEventListener('click', (e) => {
			e.preventDefault();
			localStorage.removeItem('token');
			location.reload();
		});
		navBar.prepend(logout, myPage);
	} else {
		const login = createA('/login', '로그인');
		const register = createA('/register', '회원가입');
		navBar.prepend(login, register);
	}
}

function createA(href, text) {
	const liTag = document.createElement('li');
	const aTag = document.createElement('a');
	aTag.href = href;
	aTag.textContent = text;
	liTag.append(aTag);
	return liTag;
}

async function getDataFromApi() {
	// 예시 URI입니다. 현재 주어진 프로젝트 코드에는 없는 URI입니다.
	const data = await Api.get('/api/user/data');
	const random = randomId();

	console.log({ data });
	console.log({ random });
}

// 슬라이드 이미지
new Swiper('.promotion .swiper-container', {
	autoplay: {
		delay: 5000, //5초
	},
	loop: true, // 반복 재생 여부
	slidesPerView: 3, // 한 번에 보여줄 슬라이드 개수
	spaceBetween: 0, // 슬라이드 사이 여백
	centeredSlides: true, // 1번 슬라이드가 가운데 보이기
	pagination: {
		el: '.promotion .swiper-pagination', //페이지 번호 요소 선택자
		clickable: true, //사용자의 페이지 번호 요소 제어
	},
	navigation: {
		prevEl: '.promotion .swiper-prev',
		nextEl: '.promotion .swiper-next',
	},
});
