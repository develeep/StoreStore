import { renderGnb } from '/renderGnb.js';
import * as Api from '/api.js';

const submitButton = document.querySelector('#submitButton');
const deleteCompleteButton = document.querySelector('#deleteCompleteButton');
const deleteCancelButton = document.querySelector('#deleteCancelButton');
const passwordInput = document.querySelector('#passwordInput');

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 ß깔끔하게 하는 역할임.
async function addAllElements() {}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
	submitButton.addEventListener('click', signout);
	deleteCompleteButton.addEventListener('click', deleteButton);
	deleteCancelButton.addEventListener('click', cancelButton);
}

// 모달
async function signout(e) {
	e.preventDefault();
	const password = passwordInput.value;
	if (password.length == 0) {
		return swal('비밀번호를 입력해 주세요');
	}
	swal({
		title:'회원 탈퇴',
		text:'회원정보 삭제 시 복구할 수 없습니다. 정말로 삭제하시겠습니까?',
		buttons: {
			yes: '네',
			cancel: '아니요',
		},
	}).then((value) => {
		switch (value) {
			case 'defeat':
				break;
			case 'yes':

					Api.delete('/api/delete', '', { password: password }).then(()=>{
						swal('회원탈퇴가 완료되었습니다.').then(() => {
							localStorage.removeItem('token');
							window.location.href = '/';
						});
					}).catch((err)=>{
						swal(err.message)
					})
					
		}
	});
}

async function deleteButton(e) {
	e.preventDefault();
	try {
		const password = passwordInput.value;
		await Api.delete('/api/delete', '', { password: password });
		swal('회원탈퇴가 완료되었습니다.').then(() => {
			localStorage.removeItem('token');
			window.location.href = '/';
		});
	} catch (err) {
		swal(err.message);
		document.getElementById('modal').style.display = 'none';
		document.getElementById('modal').style.backgroundColor = 'none';
	}
}

function cancelButton(e) {
	e.preventDefault();
	document.getElementById('modal').style.display = 'none';
	document.getElementById('modal').style.backgroundColor = 'none';
}
