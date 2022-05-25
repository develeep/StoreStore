// 요소 가져오기
const userInfoTitle = document.querySelector('#userInfoTitle')
const nameInput = document.querySelector('#nameInput');
const passwordInput = document.querySelector('#passwordInput');
const passwordConfirmInput = document.querySelector('#passwordConfirmInput');
const postalCodeDiv = document.querySelector('#sample6_postcode');
const addressDiv = document.querySelector('#sample6_address');
const detailAddressDiv = document.querySelector('#sample6_detailAddress');
const extraAddressDiv = document.querySelector('#sample6_extraAddress');
const phoneNumberInput = document.querySelector('#phoneNumberInput');
const saveButton = document.querySelector('#saveButton');

// 비밀번호와 비밀번호 확인의 값을 비교하는 함수
function comparePassword(e) {
    e.preventDefault();
    if (passwordInput.value !== passwordConfirmInput.value) {
        alert('입력된 비밀번호와 비밀번호 확인의 값이 다릅니다.');
    }
}

// 전화번호가 유효한지 확인하는 함수. -(하이픈) 유무에 상관없게 작성함.
function confirmPhoneNumber(e) {
    e.preventDefault();
    if (/^[0-9]{2,3}-?[0-9]{3,4}-?[0-9]{4}/.test(phoneNumberInput.value)) {
        return;
    }
    alert('유효하지 않은 전화번호입니다.')
    return;
}

// 주소 전달과 확인용 함수. 콘솔에서 입력된 주소를 확인.
function addressConfirm(e) {
    e.preventDefault();

    const postalCode = postalCodeDiv.value;
    const address1 = addressDiv.value + extraAddressDiv.value;
    const address2 = detailAddressDiv.value;
    // 저장될 주소 객체
    const address = {
        postalCode,
        address1,
        address2,
    }

    // 콘솔 주소 확인용
    // const str = JSON.stringify(address);
    // console.log(str);
}

saveButton.addEventListener('click', comparePassword);
saveButton.addEventListener('click', confirmPhoneNumber);
saveButton.addEventListener('click', addressConfirm);