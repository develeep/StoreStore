const submitButton = document.querySelector('#submitButton');
const deleteCompleteButton = document.querySelector('#deleteCompleteButton');
const deleteCancelButton = document.querySelector('#deleteCancelButton');

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
	loginMatch();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
	submitButton.addEventListener('click', signout);
	deleteCompleteButton.addEventListener('click', deleteButton);
	deleteCancelButton.addEventListener('click', cancelButton);
}

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

// 모달
function signout(e) {
	e.preventDefault();
	document.getElementById('modal').style.display = 'block';
	document.getElementById('modal').style.backgroundColor = 'black';
}

function deleteButton(e) {
	e.preventDefault();
}

function cancelButton(e) {
	e.preventDefault();
	document.getElementById('modal').style.display = 'none';
	document.getElementById('modal').style.backgroundColor = 'none';
}
