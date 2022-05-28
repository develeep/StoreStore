import { loginMatch } from '/loginMatch.js';
import * as Api from '/api.js';

// 요소(element), input 혹은 상수
const inputCategory = document.getElementById('input-category');

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
	loginMatch();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {}

// 카테고리 api 가져오기
const categories = await Api.get('/api/getcategorys');

for (const [key, value] of Object.entries(categories)) {
	// console.log(`${key}: ${value}`);
	let itemList = '';
	for (let i of value) {
		itemList += `<li><a href="/products/${i}">${i}</a></li>`;
	}
	inputCategory.innerHTML += `<li><a href="/products/${key}">${key}</a>
	<ul>
	${itemList}
	</ul>
</li>`;
}
