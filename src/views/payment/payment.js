import * as Api from '/api.js';
import { loginMatch } from '/loginMatch.js'

const fullNameInput = document.querySelector('#nameInput');
const updatePasswordButton = document.querySelector('#updatePasswordButton');
const passwordInput = document.querySelector('#passwordInput');
const passwordConfirmLabel = document.querySelector('#passwordConfirmLabel');
const passwordConfirmInput = document.querySelector('#passwordConfirmInput');
const postalCodeDiv = document.querySelector('#sample6_postcode');
const addressDiv = document.querySelector('#sample6_address');
const detailAddressDiv = document.querySelector('#sample6_detailAddress');
const phoneNumberInput = document.querySelector('#phoneNumberInput');

addAllEvents();
addAllElements();

function addAllElements() {
    loginMatch();
}

function addAllEvents() {
    // 2. 결제하기 버튼을 눌렀을 시 결제되어 최종주문된 상품 DB 추가, 주문조회에 추가 => 이후 주문조회에서 주문취소 버튼 만들고 
}

// 1. 화면 로딩 시 => 주문자 정보를 가져와서 띄우기(유저정보관리 페이지 코드 참조, 수정예정)
// async function getUserInfo() {
// 	try {
// 		const userData = await Api.get('/api/update');
// 		console.log(userData)
// 		fullNameInput.value = userData.fullName;
// 		if(userData.address){
// 			const {postalCode,address1,address2} = userData.address;
// 			postalCodeDiv.value = postalCode;
// 			addressDiv.value = address1;
// 			detailAddressDiv.value = address2;
// 		}
// 		if(userData.phoneNumber){
// 			phoneNumberInput.value = userData.phoneNumber
// 		}
// 		passwordInput.style.display = "none";
// 		passwordConfirmLabel.style.display = "none";
// 		passwordConfirmInput.style.display = "none";
// 	} catch (err) {
// 		console.error(err.stack);
// 		alert(`회원정보를 받아오지 못했습니다.: ${err.message}`);
// 	}
// }