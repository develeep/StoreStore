import { getElement, getElementAll } from '/useful-functions.js';
import { renderGnb } from '/renderGnb.js';
import * as Api from '/api.js';

const categorySelectBox = getElement('#categorySelectBox');
const categroyButton = getElement('#modal_btn');
const BcategoryInput = getElement('#Bcategory');
const ScategoryInput = getElement('#Scategory');
const ScategoyUl = getElement('#ScategoyUl');
let categorysData = [];
const addForm = document.getElementById('addForm');
const nameInput = document.getElementById('titleInput');
const categoryInput = document.getElementById('Scategory');
const companyInput = document.getElementById('manufacturerInput');
const descriptionInput = document.getElementById('descriptionInput');
const inventoryInput = document.getElementById('inventoryInput');
const priceInput = document.getElementById('priceInput');
const imageInput = document.getElementById('img');
// const categorySelectBox = document.getElementById('categorySelectBox');

addAllElements();
addAllEvents();
var imageFile;
// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
	renderGnb();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
const modalwrap = document.getElementById('modal_btn');

modalwrap.addEventListener('click', async (e) => {});

function addAllEvents() {
	imageInput.addEventListener('change', loadFile);
	addForm.addEventListener('submit', addProudct);
}
categroyButton.addEventListener('click', async (e) => {
	e.preventDefault();
	document.querySelector('.modal_wrap').style.display = 'block';
	document.querySelector('.black_bg').style.display = 'block';

	categorySelectBox.innerHTML = null;

	const categories = await Api.get('/api/getcategorys');

	let categorys = Object.entries(categories);
	console.log(categories);
	console.log(categorys);

	const option = document.createElement('option');
	option.textContent = '카테고리를 선택해 주세요.';
	categorySelectBox.append(option);

	categorys.forEach(([key, value]) => {
		const optionItem = document.createElement('option');
		optionItem.value = key;
		optionItem.textContent = key;
		categorySelectBox.append(optionItem);
	});

	categorySelectBox.addEventListener('change', async (event) => {
		const targetCategory = event.target.value;
		categorysData = categories[targetCategory];
		// console.log(categorysData);
		// await categoryReset(categorysData);
		// 카테고리추가
		categoryReset(targetCategory, categorysData);
	});
});

const modalclose = document.querySelector('.modal_close');

modalclose.addEventListener('click', async (e) => {
	e.preventDefault();
	document.querySelector('.modal_wrap').style.display = 'none';
	document.querySelector('.black_bg').style.display = 'none';
});

async function categoryReset(targetCategory) {
	const category = document.createElement('div');
	category.classList.add('category-item');
	console.log(categorysData);
	categorysData.forEach((data) => {
		const item = addItem(data);
		category.append(item);
	});

	const categoryInput = document.createElement('input');
	categoryInput.id = 'categoryInput';
	categoryInput.type = 'text';
	const categoryAdd = document.createElement('button');
	categoryAdd.id = categoryAdd;
	categoryAdd.textContent = '추가';

	ScategoyUl.innerHTML = null;
	ScategoyUl.append(category, categoryInput, categoryAdd);

	categoryAdd.addEventListener('click', async (e) => {
		e.preventDefault();

		const ScateogryInput = categoryInput.value;
		console.log(targetCategory, ScateogryInput);
		const data = { targetCategory, ScateogryInput };
		const newCategory = await Api.post('/api/category_update', data);
		if (newCategory.result == 'ok') {
			categorysData.push(ScateogryInput);
			categoryReset(targetCategory, categorysData);
		} else {
			alert('error');
		}
	});
}

function addItem(itemName) {
	const li = document.createElement('li');
	li.id = 'categoryId';
	const btn = document.createElement('button');
	btn.id = 'categoryName';
	btn.textContent = itemName;

	const updateInput = document.createElement('input');
	updateInput.id = 'updateInput';
	updateInput.classList.add('hide');
	const updateInputSubmit = document.createElement('button');
	updateInputSubmit.id = 'updateInputSubmit';
	updateInputSubmit.classList.add('hide');
	updateInputSubmit.textContent = '저장';

	const delBtn = document.createElement('button');
	delBtn.id = 'delete';
	const delIcon = document.createElement('i');
	delIcon.classList.add('fa', 'fa-trash');
	delBtn.append(delIcon);

	const updateBtn = document.createElement('button');
	updateBtn.id = 'update';
	const updateIcon = document.createElement('i');
	updateIcon.classList.add('fas', 'fa-edit');
	updateBtn.append(updateIcon);

	li.append(btn, updateInput, updateInputSubmit, delBtn, updateBtn);

	btn.addEventListener('click', (e) => {
		e.preventDefault();
		const categoryData = btn.textContent;
		BcategoryInput.value = getElement('#categorySelectBox').value;
		ScategoryInput.value = categoryData;
		document.querySelector('.modal_wrap').style.display = 'none';
		document.querySelector('.black_bg').style.display = 'none';
	});

	delBtn.addEventListener('click', (e) => {
		e.preventDefault();
		try {
			swal(
				'카테고리 삭제시 해당 카테고리의 상품이 전부 삭제됩니다. 정말 삭제하시겠습니까?',
				{
					buttons: {
						cancel: '아니요',
						yes: '네',
					},
				},
			).then((value) => {
				switch (value) {
					case 'cancel':
						break;
					case 'yes':
						const selectedCategory = { selectedCategory: itemName };
						Api.delete('/api/Categorydelete', '', selectedCategory).then(() => {
							li.remove();
							categorysData.forEach((data, index) => {
								if (data === itemName) {
									categorysData.splice(index, 1);
								}
							});
							console.log(categorysData);
						});
				}
			});
		} catch (err) {
			alert(err.message);
		}
	});
	updateBtn.addEventListener('click', (e) => {
		e.preventDefault();

		delBtn.classList.toggle('hide');
		btn.classList.toggle('hide');
		updateInput.classList.toggle('hide');
		updateInputSubmit.classList.toggle('hide');
	});
	updateInputSubmit.addEventListener('click', (e) => {
		e.preventDefault();
		try {
			const newData = updateInput.value;
			const data = { OldData: itemName, NewData: newData };
			console.log(data);
			Api.patch('/api/Ucategory', '', data).then(() => {
				btn.textContent = newData;
				categorysData.forEach((data, index) => {
					categorysData[index] === data
						? (categorysData[index] = newData)
						: false;
				});
				updateInput.classList.toggle('hide');
				updateInputSubmit.classList.toggle('hide');
				delBtn.classList.toggle('hide');
				btn.classList.toggle('hide');
			});
		} catch (err) {
			alert(err.message);
		}
	});
	return li;
}
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

function addProudct(e) {
	e.preventDefault();
	const formData = new FormData();


	formData.append(nameInput.name, nameInput.value);
	formData.append(categoryInput.name, categoryInput.value);
	formData.append(companyInput.name, companyInput.value);
	formData.append(descriptionInput.name, descriptionInput.value);
	formData.append(inventoryInput.name, inventoryInput.value);
	formData.append(priceInput.name, priceInput.value);
	formData.append(imageInput.name, imageInput.files[0]);

	let object = {};
	formData.forEach(function(value, key){
			object[key] = value;
	});
	console.log(object)
	swal(
		'상품을 추가하시겠습니까?',
		{
			buttons: {
				cancel: '아니요',
				yes: '네',
			},
		},
	).then((value) => {
		switch (value) {
			case 'cancel':
				break;
			case 'yes':
				Api.formPost('/api/products',formData).then(()=>{
					swal('상품 추가가 완료되었습니다.').then(()=>{
						location.href = '/admin'
					})
				}).catch((err)=>{
					alert(err.message)
				})
		}
	});
	
}
