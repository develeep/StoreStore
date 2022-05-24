회원정보 관리
논의할 사항
비밀번호 양식 통일 (ex. 8글자 이상, 영문숫자 혼용 등...)
BackEnd 요청
처음 실행되었을 때:
1. `이름`과 `주소 값`을 저장한 적 있으면 => DB에서 불러옴
2. 없으면: 회원가입시 입력했던 `이름`만 DB에서 불러옴

// 요소 가져오기
const userInfoTitle = document.querySelector('#userInfoTitle')
const nameInput = document.querySelector('#nameInput');
const passwordInput = document.querySelector('#passwordInput');
const passwordConfirmInput = document.querySelector('#passwordConfirmInput');
const postalCodeInput = document.querySelector('#postalCodeInput');
const searchAddressButton = document.querySelector('#searchAddressButton');
const addressInput = document.querySelector('#addressInput');
const address2Input = document.querySelector('#address2Input');
const phoneNumberInput = document.querySelector('#phoneNumberInput');
const saveButton = document.querySelector('#saveButton');

// 비밀번호와 비밀번호 확인의 값을 비교하는 함수
function comparePassword() {
    if (passwordInput.value !== passwordConfirmInput.value) {
        alert('입력된 비밀번호와 비밀번호 확인의 값이 다릅니다.');
    }
}

// 전화번호가 유효한지 확인하는 함수. -(하이픈) 유무에 상관없게 작성함.
function confirmPhoneNumber() {
    if (/^[0-9]{2,3}-?[0-9]{3,4}-?[0-9]{4}/.test(phoneNumberInput.value)) {
        return;
    }
    alert('유효하지 않은 전화번호입니다.')
    return;
}

saveButton.addEventListener('click', comparePassword);
saveButton.addEventListener('click', confirmPhoneNumber);