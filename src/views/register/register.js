import * as Api from '/api.js';
import { validateEmail,getElement,getElementAll } from '/useful-functions.js';

// 요소(element), input 혹은 상수
const fullNameInput = getElement('#fullNameInput');
const emailInput = getElement('#emailInput');
const emailcheck = getElement('#emailcheck');
const sendemailButton = getElement('#send-email-button');
const emailcheckButton = getElement('#email-check-button');
const passwordInput = getElement('#passwordInput');
const passwordConfirmInput = getElement('#passwordConfirmInput');
const submitButton = getElement('#submitButton');
const navBar = getElement('#navbar')

const failnameMessage = getElement('.failname-message');
const failemailMessage = getElement('.failemail-message');
const failpassMessage = getElement('.failpass-message');
const misspassMessage = getElement('.misspass-message');
const successMessage = getElement('.success-message')

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
	createLogin()
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
	submitButton.addEventListener('click', handleSubmit);
}

function createLogin() {

	const liTag = document.createElement('li');
	const aTag = document.createElement('a');
	aTag.href = `/login${location.search}`;
	aTag.textContent = '로그인';
	liTag.append(aTag);
	navBar.prepend(liTag);
}
// 두 값이 일치하는지 확인하는 Match 함수 작성
function Match(password1, password2) {
	return password1 === password2;
}

// 인증요청

sendemailButton.addEventListener('click', async (e) => {
	e.preventDefault();
	try {
		const email = emailInput.value;
		const data = { email };
		if(!validateEmail(email)){
			swal('이메일 형식이 맞지 않습니다.')
			return;
		}
		const email_data = await Api.post('/api/sendmail', data);
		console.log(email_data);
		if (email_data.result === 'send') {
			getEmailCorrect();
		} else {
			throw new Error('이미 존재하는 이메일 입니다.');
		}
	} catch (err) {
		swal({
			text: err.message,
		});
	}
});

function getEmailCorrect() {
	swal({
		title: '이메일 인증을 진행해 주세요',
		text: '이메일로 도착한 인증번호를 입력해 주세요',
		content: 'input',
		button: {
			text: '인증하기',
			closeModal: false,
		},
	})
		.then((Enumber) => {
			console.log(Enumber.result);
			if (!Enumber) throw new Error('인증값을 입력해 주세요');
			let hashAuth = decodeURIComponent(document.cookie).split('=');
			hashAuth = hashAuth[hashAuth.length - 1];
			console.log(hashAuth);
			const data = { Enumber, hashAuth };
			console.log(data);
			return Api.post('/api/checkEmail', data);
		})
		.then((data) => {
			console.log(data);
			if (data.result === 'success') {
				swal({
					text: '인증을 완료했습니다.',
					icon: 'success',
				});
				localStorage.setItem('mail', emailInput.value);
			} else {
				swal({
					text: '인증에 실패했습니다. 다시 시도해 주세요',
					icon: 'error',
					button: {
						text: '다시 인증하기',
						closeModal: false,
					},
				}).then(() => {
					getEmailCorrect();
				});
			}
		});
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
	const emailMatch = localStorage.getItem('mail')
	if(emailInput.value === emailMatch){
		successMessage.classList.remove('hide');
	}
	else{
		successMessage.classList.add('hide')
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
		return swal('이름은 2글자 이상, 비밀번호는 4글자 이상이어야 합니다.');
	}

	if (!isEmailValid) {
		return swal('이메일 형식이 맞지 않습니다.');
	}

	if (!isPasswordSame) {
		return swal('비밀번호가 일치하지 않습니다.');
	}

	// 회원가입 api 요청
	try {
		const data = { fullName, email, password };
		const correctEmail = localStorage.getItem('mail');
		if (correctEmail===emailInput.value) {
			await Api.post('/api/register', data);
			const login = { email, password };
			const result = await Api.post('/api/login', login);
			const token = result.token;
			swal({
				text: '가입이 완료되었습니다.',
			}).then(() => {
				localStorage.setItem('token', token);
				window.location.href = '/';
			});
		} else {
			throw new Error('이메일 인증을 진행해 주세요');
		}

		// 로그인 페이지 이동
	} catch (err) {
		console.error(err.stack);
		swal({
			text: err.message,
		});
	}
}

window.onunload=()=>{
	localStorage.removeItem('mail');
}