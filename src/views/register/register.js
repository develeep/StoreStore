import * as Api from '/api.js';
import { validateEmail } from '/useful-functions.js';

// 요소(element), input 혹은 상수
const fullNameInput = document.querySelector('#fullNameInput');
const emailInput = document.querySelector('#emailInput');
const passwordInput = document.querySelector('#passwordInput');
const passwordConfirmInput = document.querySelector('#passwordConfirmInput');
const submitButton = document.querySelector('#submitButton');

const failnameMessage = document.querySelector('.failname-message');
const failemailMessage = document.querySelector('.failemail-message');
const failpassMessage = document.querySelector('.failpass-message');
const misspassMessage = document.querySelector('.misspass-message');

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
	submitButton.addEventListener('click', handleSubmit);
}

// 두 값이 일치하는지 확인하는 Match 함수 작성
function Match(password1, password2) {
	return password1 === password2;
}

// 입력창에 onkeyup 이벤트가 발생했을때(키보드의 키를 눌렀다가 뗐을때) 사용하는 함수 작성
fullNameInput.onkeyup = function () {
	const fullName = fullNameInput.value;
	if (fullName.length >= 2) {
		// classlist에 hide를 추가해 실패메세지 숨김
		failnameMessage.classList.add('hide');
	} else {
		// classlist에 hide를 지워서 실패메세지 출력
		failnameMessage.classList.remove('hide');
	}
};

emailInput.onkeyup = function () {
	const email = emailInput.value;
	if (validateEmail(email)) {
		// classlist에 hide를 추가해 실패메세지 숨김
		failemailMessage.classList.add('hide');
	} else {
		// classlist에 hide를 지워서 실패메세지 출력
		failemailMessage.classList.remove('hide');
	}
};

passwordInput.onkeyup = function () {
	const password = passwordInput.value;
	if (password.length >= 4) {
		// classlist에 hide를 추가해 실패메세지 숨김
		failpassMessage.classList.add('hide');
	} else {
		// classlist에 hide를 지워서 실패메세지 출력
		failpassMessage.classList.remove('hide');
	}
};

passwordConfirmInput.onkeyup = function () {
	const password = passwordInput.value;
	const passwordConfirm = passwordConfirmInput.value;
	// 미리 작성해두었던 match 함수 사용
	// 패스워드 입력, 확인창에 입력된 값이 일치하는지
	// 확인해야 하기 때문에 .value 사용
	if (Match(password, passwordConfirm)) {
		// classlist에 hide를 추가해 실패메세지 숨김
		misspassMessage.classList.add('hide');
	} else {
		// classlist에 hide를 지워서 실패메세지 출력
		misspassMessage.classList.remove('hide');
	}
};

// 회원가입 진행
async function handleSubmit(e) {
	e.preventDefault();

	const fullName = fullNameInput.value;
	const email = emailInput.value;
	const password = passwordInput.value;
	const passwordConfirm = passwordConfirmInput.value;

	// 잘 입력했는지 확인
	const isFullNameValid = fullName.length >= 2;
	const isEmailValid = validateEmail(email);
	const isPasswordValid = password.length >= 4;
	const isPasswordSame = password === passwordConfirm;

	if (!isFullNameValid || !isPasswordValid) {
		return alert('이름은 2글자 이상, 비밀번호는 4글자 이상이어야 합니다.');
	}

	if (!isEmailValid) {
		return alert('이메일 형식이 맞지 않습니다.');
	}

	if (!isPasswordSame) {
		return alert('비밀번호가 일치하지 않습니다.');
	}

	// 회원가입 api 요청
	try {
		const data = { fullName, email, password };

		await Api.post('/api/register', data);

		alert(`정상적으로 회원가입되었습니다.`);

		// 로그인 페이지 이동
		window.location.href = '/login/home';
	} catch (err) {
		console.error(err.stack);
		alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
	}
}
