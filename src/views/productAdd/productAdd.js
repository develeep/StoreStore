import { getElement, getElementAll } from '/useful-functions.js';
import { renderGnb } from '/renderGnb.js';
import * as Api from '/api.js';

const categorySelectBox = document.getElementById('categorySelectBox');
const categroyButton = document.getElementById('categroyButton');
const BcategoryInput = document.getElementById('Bcategory');
const ScategoryInput = document.getElementById('Scategory');
// const categorySelectBox = document.getElementById('categorySelectBox');

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
	renderGnb();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {}
categroyButton.addEventListener('click', async (e) => {
	e.preventDefault();
	const categories = await Api.get('/api/getcategorys');
	let categorys = Object.entries(categories);
	for (const [key, value] of categorys) {
		let newItem = value.reduce(function (target, key) {
			target[key] = key;
			return target;
		}, {});
		categories[key] = newItem;
	}

	const { value: category } = await Swal.fire({
		title: 'CATEGORY',
		input: 'select',
		inputOptions: categories,
		inputPlaceholder: 'CATEGORY를 선택해주세요.',
		showCancelButton: true,
	});

	let Bcategory = categorys.find((e) => e[1].includes(category))[0];
	BcategoryInput.value = Bcategory;
	ScategoryInput.value = category;
	console.log(category);
	console.log(Bcategory);
});

// // 카테고리 api 가져오기
// const categories = await Api.get('/api/getcategorys');
// console.log(categories);

// // 카테고리 데이터 옵션에 추가
// for (const [key, value] of Object.entries(categories)) {
// 	categorySelectBox.innerHTML += `<option value>${key}</option>`;
// }

// `<select id="subCategorySelectBox">
// <option value>하위 카테고리를 선택해 주세요.</option>
// </select>`
