// 요소 가져오기
import * as Api from '/api.js';
import { renderGnb } from '/renderGnb.js';

const userInfoTitle = document.querySelector('#userInfoTitle');
const fullNameInput = document.querySelector('#nameInput');
const updatePasswordButton = document.querySelector('#updatePasswordButton');
const passwordInput = document.querySelector('#passwordInput');
const passwordConfirmLabel = document.querySelector('#passwordConfirmLabel');
const passwordConfirmInput = document.querySelector('#passwordConfirmInput');
const postalCodeDiv = document.querySelector('#postcodeInput');
const addressDiv = document.querySelector('#addressInput');
const detailAddressDiv = document.querySelector('#detailAddressInput');
const phoneNumberInput = document.querySelector('#phoneNumberInput');
const saveButton = document.querySelector('#saveButton');

addAllEvents();
addAllElements();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {}

function addAllEvents() {
	renderUserInfo();
	updatePasswordButton.addEventListener('click', updatePassword);
	saveButton.addEventListener('click', updateUser);
}

function updatePassword(e) {
	e.preventDefault();

	updatePasswordButton.style.display = 'none';
	passwordInput.style.display = 'block';
	passwordConfirmLabel.style.display = 'block';
	passwordConfirmInput.style.display = 'block';
}

// 페이지 로드 시 저장된 유저 정보를 화면에 띄우는 함수
async function renderUserInfo() {
	try {
		const userData = await Api.get('/api/users');
		console.log(userData);
		nameInput.value = userData.fullName;
		if (userData.address) {
			const { postalCode, address1, address2 } = userData.address;
			postalCodeDiv.value = postalCode;
			addressDiv.value = address1;
			detailAddressDiv.value = address2;
		}
		if (userData.phoneNumber) {
			phoneNumberInput.value = userData.phoneNumber;
		}
		passwordInput.style.display = 'none';
		passwordConfirmLabel.style.display = 'none';
		passwordConfirmInput.style.display = 'none';
	} catch (err) {
		swal(`${err.message}`).then(() => {
			location.href = '/';
		});
	}
}

// 성공했을 때만 유저 객체 생성
async function updateUser(e) {
	e.preventDefault();

	const fullName = fullNameInput.value;
	const password = passwordInput.value;
	const postalCode = postalCodeDiv.value;
	const address1 = addressDiv.value;
	const address2 = detailAddressDiv.value;
	const phoneNumber = phoneNumberInput.value;

	// 존재하는 개인정보 요소를 validation 진행
	if (fullName) {
		console.log(fullName);
		const isFullNameValid = fullName.length >= 2;
		if (!isFullNameValid) {
			return swal('이름은 2글자 이상이어야 합니다.');
		}
	}
	if (password) {
		const isPasswordValid = password.length >= 4;
		const isPasswordSame = password === passwordConfirmInput.value;
		if (!isPasswordValid) {
			return swal('비밀번호는 4글자 이상이어야 됩니다.');
		}
		if (!isPasswordSame) {
			return swal('비밀번호가 일치하지 않습니다.');
		}
	}
	if (phoneNumber) {
		if (!/^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}/.test(phoneNumber)) {
			return swal('유효하지 않은 전화번호입니다.');
		}
	}
	if (postalCode || address1 || address2) {
		if (!postalCode || !address1 || !address2) {
			return swal('주소를 제대로 입력해주세요.');
		}
	}

	// 저장될 객체
	const address = {
		postalCode,
		address1,
		address2,
	};
	const userObject = {
		fullName,
		password,
		address,
		phoneNumber,
	};

	// 콘솔로 유저 객체 확인
	// const str = JSON.stringify(userObject);
	// console.log(str);
	try {
		await Api.patch('/api/update', '', userObject);
		swal(`정상적으로 수정되었습니다.`).then(() => {
			location.href = '/mypage/userinfo';
		});
	} catch (err) {
		console.error(err.stack);
		swal(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
	}
}
