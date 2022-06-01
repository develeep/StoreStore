import { renderGnb } from '/renderGnb.js';
import { isAdmin } from '/useful-functions.js';

checkLoginAdmin();
addAllElements();
// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {}

async function checkLoginAdmin() {
	try {
		if (!(await isAdmin())) {
			swal('관리자가 아닙니다.').then(() => {
				location.href = '/';
			});
		}
	} catch (err) {
		swal(err.message).then(() => {
			const url = location.href;
			const beforeURI = encodeURIComponent(url);
			location.href = `/login?beforeURI=${beforeURI}`;
		});
	}
}
