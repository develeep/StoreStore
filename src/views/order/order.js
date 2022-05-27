import { loginMatch } from '/loginMatch.js'

const orderInfoButton = document.querySelector('#orderInfo');
// const checkBoxAll = document.querySelector("#checkBoxAll");

orderInfoButton.addEventListener("click", addAllElements);

addAllElements()
// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  loginMatch();
}

function orderInfo() {
  //주문 조회 상세 페이지로 이동
}