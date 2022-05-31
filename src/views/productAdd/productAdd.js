import { getElement, getElementAll } from '/useful-functions.js';
import { renderGnb } from '/renderGnb.js';
import * as Api from '/api.js';

const categorySelectBox = document.getElementById('categorySelectBox');
const categroyButton = document.getElementById('categroyButton');
const BcategoryInput = document.getElementById('Bcategory');
const ScategoryInput = document.getElementById('Scategory');
const ScategoyUl = document.getElementById('ScategoyUl');
// const categorySelectBox = document.getElementById('categorySelectBox');

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
	renderGnb();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {}

const modalwrap = document.getElementById('modal_btn');

modalwrap.addEventListener('click', async (e) => {
	e.preventDefault();
	document.querySelector('.modal_wrap').style.display = 'block';
	document.querySelector('.black_bg').style.display = 'block';

	const categories = await Api.get('/api/getcategorys');
	let categorys = Object.entries(categories);
	categorySelectBox.innerHTML += `<option value>카테고리를 선택해주세요.</option>`;
	for (const [key, value] of categorys) {
		categorySelectBox.innerHTML += `<option value="${key}">${key}</option>`;
	}
	categorySelectBox.addEventListener('change', async (event) => {
		const targetCategory = event.target.value;
		const categorysData = await categorys.find(
			(e) => e[0] == targetCategory,
		)[1];
		console.log(categorysData);
		await categoryReset(categorysData);
		// 카테고리추가
		const categoryAdd = document.getElementById('categoryAdd');
		let cateogryInput = document.getElementById('cateogryInput');
		categoryAdd.addEventListener('click', async (e) => {
			e.preventDefault();
			const ScateogryInput = cateogryInput.value;
			const data = { targetCategory, ScateogryInput };
			const newCategory = await Api.post('/api/category_update', data);
			if (newCategory.result == 'ok') {
				categorysData.push(ScateogryInput);
				await categoryReset(categorysData);
			} else {
				alert('error');
			}
		});
		// 카테고리삭제
		const categoryLi = document.querySelectorAll('#categoryId');
		categoryLi.forEach(async (el) => {
			const deleteButton = el.querySelector('#delete');
			deleteButton.addEventListener('click', async (e) => {
				e.preventDefault();
				const selectedCategory = el.querySelector('#categoryName').innerText;
				const data = { selectedCategory };
				console.log(data);
				const deleteCategory = await Api.delete(
					'/api/Categorydelete',
					'',
					data,
				);
				console.log(deleteCategory);
			});
		});
	});
});

const modalclose = document.querySelector('.modal_close');

modalclose.addEventListener('click', async (e) => {
	e.preventDefault();
	document.querySelector('.modal_wrap').style.display = 'none';
	document.querySelector('.black_bg').style.display = 'none';
});

async function categoryReset(categorysData) {
	let Scategorys = await categorysData.reduce(function (prev, curr) {
		return (
			prev +
			`<li id = "categoryId"><button id = "categoryName">${curr}</button><button id = "delete"><i class="fa fa-trash"></i></button></li>`
		);
	}, '');
	ScategoyUl.innerHTML = `${Scategorys}<input id='cateogryInput' type='text'></input><button id='categoryAdd'>추가</button>`;
}
