export const loginMatch = () => {
	console.log(hasLoginToken())
  if (hasLoginToken()) {
    renderLogout();
  } else {
    renderLogin();
  }
}

const hasLoginToken = () => {
  return Boolean(localStorage.getItem('token'));
}

const renderLogout = () => {
	const navBar = document.querySelector('#navbar');
	const logout = createA('/', '로그아웃');
	const myPage = createA('/mypage', '마이페이지');
	logout.addEventListener('click', (e) => {
		e.preventDefault();
		localStorage.removeItem('token');
		location.reload();
	});
	navBar.prepend(logout, myPage);
}

const  renderLogin = () => {
	const navBar = document.querySelector('#navbar');
	const params = location.href.trim().split('/')
	params.splice(0,3) 
	const login = createA(`/login/${params.length==1?'home':params}`, '로그인');
	const register = createA('/register', '회원가입');
	navBar.prepend(login, register);
}


function createA(href, text) {
	const liTag = document.createElement('li');
	const aTag = document.createElement('a');
	aTag.href = href;
	aTag.textContent = text;
	liTag.append(aTag);
	return liTag;
}

