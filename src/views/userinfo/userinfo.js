// 요소 가져오기
import * as Api from '/api.js';
import { loginMatch } from '/loginMatch.js'

const userInfoTitle = document.querySelector('#userInfoTitle');
const fullNameInput = document.querySelector('#nameInput');
const updatePasswordButton = document.querySelector('#updatePasswordButton');
const passwordInput = document.querySelector('#passwordInput');
const passwordConfirmLabel = document.querySelector('#passwordConfirmLabel');
const passwordConfirmInput = document.querySelector('#passwordConfirmInput');
const postalCodeDiv = document.querySelector('#sample6_postcode');
const addressDiv = document.querySelector('#sample6_address');
const detailAddressDiv = document.querySelector('#sample6_detailAddress');
const extraAddressDiv = document.querySelector('#sample6_extraAddress');
const phoneNumberInput = document.querySelector('#phoneNumberInput');
const saveButton = document.querySelector('#saveButton');
// const failnameMessage = document.querySelector('.failname-message');
// // const failemailMessage = document.querySelector('.failemail-message');
// const failpassMessage = document.querySelector('.failpass-message');
// const misspassMessage = document.querySelector('.misspass-message');

getUserInfo();
addAllEvents();
addAllElements()

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  loginMatch();
}

function addAllEvents() {
	updatePasswordButton.addEventListener('click', updatePassword);
	saveButton.addEventListener('click', updateUser);
}

async function getUserInfo() {
	try {
		const userData = await Api.get('/api/update');
		nameInput.value = userData.fullName;
		passwordInput.style.display = "none";
		passwordConfirmLabel.style.display = "none";
		passwordConfirmInput.style.display = "none";
		// passwordInput.style.visibility = "hidden";
		// passwordConfirmLabel.style.visibility = "hidden";
		// passwordConfirmInput.style.visibility = "hidden";
	} catch (err) {
		console.error(err.stack);
		alert(`회원정보를 받아오지 못했습니다.: ${err.message}`);
	}
}

function Match(passwordInput, passwordConfirmInput) {
	return passwordInput === passwordConfirmInput;
}

// 입력창에 onkeyup 이벤트가 발생했을때(키보드의 키를 눌렀다가 뗐을때) 사용하는 함수 작성
// fullNameInput.onkeyup = function () {
// 	const fullName = fullNameInput.value;
// 	if (fullName.length >= 2) {
// 		// classlist에 hide를 추가해 실패메세지 숨김
// 		failnameMessage.classList.add('hide');
// 	} else {
// 		// classlist에 hide를 지워서 실패메세지 출력
// 		failnameMessage.classList.remove('hide');
// 	}
// };

// passwordInput.onkeyup = function () {
// 	const password = passwordInput.value;
// 	if (password.length >= 4) {
// 		// classlist에 hide를 추가해 실패메세지 숨김
// 		failpassMessage.classList.add('hide');
// 	} else {
// 		// classlist에 hide를 지워서 실패메세지 출력
// 		failpassMessage.classList.remove('hide');
// 	}
// };

// passwordConfirmInput.onkeyup = function () {
// 	const password = passwordInput.value;
// 	const passwordConfirm = passwordConfirmInput.value;
// 	// 미리 작성해두었던 match 함수 사용
// 	// 패스워드 입력, 확인창에 입력된 값이 일치하는지
// 	// 확인해야 하기 때문에 .value 사용
// 	if (Match(password, passwordConfirm)) {
// 		// classlist에 hide를 추가해 실패메세지 숨김
// 		misspassMessage.classList.add('hide');
// 	} else {
// 		// classlist에 hide를 지워서 실패메세지 출력
// 		misspassMessage.classList.remove('hide');
// 	}
// };

function updatePassword(e) {
	e.preventDefault();

	updatePasswordButton.style.display = "none";
	passwordInput.style.display = "block";
	passwordConfirmLabel.style.display = "block";
	passwordConfirmInput.style.display = "block";
	// passwordInput.style.visibility = "visible";
	// passwordConfirmLabel.style.visibility = "visible";
	// passwordConfirmInput.style.visibility = "visible";
}

// 성공했을 때만 유저 객체 생성
async function updateUser(e){
    e.preventDefault();

	const fullName = fullNameInput.value;
	const password = passwordInput.value;
    const postalCode = postalCodeDiv.value;
    const address1 = addressDiv.value + extraAddressDiv.value;
    const address2 = detailAddressDiv.value;
	const phoneNumber = phoneNumberInput.value;
    
	// 각 요소가 있을 때
	if (fullName) {
		console.log(fullName);
		const isFullNameValid = fullName.length >= 2;
		if (!isFullNameValid) {
			return alert('이름은 2글자 이상이어야 합니다.');
		}
	}
	if (password) {
		const isPasswordValid = password.length >= 4;
		const isPasswordSame = password === passwordConfirmInput.value;
		if (!isPasswordValid) {
			return alert('비밀번호는 4글자 이상이어야 됩니다.');
		}
		if (!isPasswordSame) {
			return alert('비밀번호가 일치하지 않습니다.');
		}
	}
	if (phoneNumber) {
		// 전화번호가 유효한지 확인하는 함수. -(하이픈) 유무에 상관없게 작성함.
		if (!(/^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}/.test(phoneNumber))) {
			// window.location.href = '/mypage/userinfo';
			return alert('유효하지 않은 전화번호입니다.');
		}
	}
	if ( postalCode || address1 || address2 ) {
		if (!postalCode || !address1 || !address2) {
			return alert('주소를 제대로 입력해주세요.');
		}
	}
	// 잘 입력했는지 확인
	// const isEmailValid = validateEmail(email);
	
	// if (!isFullNameValid || !isPasswordValid) {
	// 	// window.location.href = '/mypage/userinfo';
	// 	return alert('이름은 2글자 이상, 비밀번호는 4글자 이상이어야 합니다.');
	// }

	// if (!isEmailValid) {
	// 	return alert('이메일 형식이 맞지 않습니다.');
	// }

	// 저장될 객체
    const address = {
        postalCode,
        address1,
        address2,
    }
	const userObject = {
		fullName,
		password,
		address,
		phoneNumber,
	}

    // 콘솔로 유저 객체 확인
    // const str = JSON.stringify(userObject);
    // console.log(str);
	try {
		await Api.patch("/api/update", "", userObject);
		alert(`정상적으로 수정되었습니다.`);
		// 로그인 페이지 이동
		window.location.href = '/mypage/userinfo';
	} catch (err) {
		console.error(err.stack);
		alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
	}
}