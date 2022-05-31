import { getElement, getElementAll } from '/useful-functions.js';
import { renderGnb } from '/renderGnb.js';
import * as Api from '/api.js';

const categorySelectBox = document.getElementById('categorySelectBox');
const categroyButton = document.getElementById('categroyButton');
const BcategoryInput = document.getElementById('Bcategory');
const ScategoryInput = document.getElementById('Scategory');
// const submitButton = document.getElementById('submitButton');
const nameInput = document.getElementById('titleInput');
const categoryInput = document.getElementById('Scategory');
const companyInput = document.getElementById('manufacturerInput');
const descriptionInput = document.getElementById('descriptionInput');
const inventoryInput = document.getElementById('inventoryInput');
const priceInput = document.getElementById('priceInput');
const imageInput = document.getElementById('img');
const addForm = document.getElementById('addForm');
// const categorySelectBox = document.getElementById('categorySelectBox');

addAllElements();
addAllEvents();
var imageFile;
// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
	renderGnb();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
	// submitButton.addEventListener('click', buttonSubmit);
	// imageInput.addEventListener('change', loadFile);
	// addForm.addEventListener('submit', addProudct);
}
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

async function buttonSubmit(e) {
	e.preventDefault();

	const name = nameInput.value;
	const category = categoryInput.value;
	const company = companyInput.value;
	const description = descriptionInput.value;
	const inventory = inventoryInput.value;
	const price = priceInput.value;
	const data = {
		...(name && { name }),
		...(category && { category }),
		...(company && { company }),
		...(description && { description }),
		...(inventory && { inventory }),
		...(price && { price }),
	};

	const categories = await Api.post('/api/products', data);
	console.log('등록된 상품은');
	console.log(categories);
}

function loadFile(e) {
	console.log(e.target.files[0]);
	imageFile = e.target.files[0];
}

// async function addProudct(e) {
// 	e.preventDefault();
// 	console.log('what????');
// 	const addformData = new FormData(addForm);
// 	addformData.append('img', imageFile);
// 	console.log(addformData);
// 	const result = await Api.post('/api/products', addformData);
// 	console.log('상품 추가완료되었습니다.');
// 	console.log(result);
// 	location.href = '/admin';
// }
