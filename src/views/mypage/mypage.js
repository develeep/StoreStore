import { renderGnb } from '/renderGnb.js';

isLogin();
addAllElements();
// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {

}
function isLogin() {
  if(!localStorage.getItem('token')){
    swal('로그인해 주세요').then(()=>{
      const url = location.href;
			const beforeURI = encodeURIComponent(url);
			location.href = `/login?beforeURI=${beforeURI}`;
    })
  }
}