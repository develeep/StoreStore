import * as Api from '/api.js';
import { loginMatch } from '/loginMatch.js'

const fullNameInput = document.querySelector('#nameInput');
const phoneNumberInput = document.querySelector('#phoneNumberInput');
const addressInput = document.querySelector('#addressInput');
const emailInput = document.querySelector('#emailInput');

getUserInfo();
addAllEvents();
addAllElements();

function addAllElements() {
    loginMatch();
}

function addAllEvents() {
    // 2. 결제하기 버튼을 눌렀을 시 결제되어 최종주문된 상품 DB 추가, 주문조회에 추가 => 이후 주문조회에서 주문취소 버튼 만들고 
}

// 1. 화면 로딩 시 => 주문자 정보를 가져와서 띄우기(유저정보관리 페이지 코드 참조, 수정예정)
async function getUserInfo() {
	try {
		const userData = await Api.get('/api/update');
		console.log(userData)
		fullNameInput.value = userData.fullName;
		if(userData.phoneNumber){
			phoneNumberInput.value = userData.phoneNumber
		}
        if (userData.address) {
            addressInput.value = Object.values(userData.address).join(" ")
        }
        // 3. 객체에 이메일 추가 (안되면 삭제해도 무방)
        emailInput.value = userData.email;
	} catch (err) {
		console.error(err.stack);
		alert(`회원정보를 받아오지 못했습니다.: ${err.message}`);
	}
}