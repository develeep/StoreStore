import { getElement, getElementAll } from '/useful-functions.js';
import * as Api from '/api.js';

const categorySelectBox = getElement('#categorySelectBox');
const categroyButton = getElement('#modal_btn');
const BcategoryInput = getElement('#Bcategory');
const ScategoryInput = getElement('#Scategory');
const ScategoyUl = getElement('#ScategoyUl');
const modalclose = document.querySelector('.modal_close');

const addForm = document.getElementById('addForm');
const nameInput = document.getElementById('titleInput');
const categoryInput = document.getElementById('Scategory');
const companyInput = document.getElementById('manufacturerInput');
const descriptionInput = document.getElementById('descriptionInput');
const inventoryInput = document.getElementById('inventoryInput');
const priceInput = document.getElementById('priceInput');
const imageInput = document.getElementById('img');
const imageView = document.getElementById('imageViewr');
const product = await getBeforeProductData();

let categorysData = [];
const reader = new FileReader();
reader.onload = function (e) {
	imageView.src = e.target.result;
};

async function getBeforeProductData() {
	const query = location.search;
	const searchURI = new URLSearchParams(query);
	const productId = searchURI.get('productId');
	if (!productId) {
		swal('상품정보가 없습니다.').then(() => {
			location.href = '/admin/productList/';
		});
	}
	const productData = await Api.get('/api/product', productId);
	console.log(productData);
	return productData;
}
inputBeforeProductData();
async function inputBeforeProductData() {
	console.log(product);
	nameInput.value = product.name;
	const category = await Api.get('/api/categoryname', product.productId);
	const categoryArr = category.split('/');
	BcategoryInput.value = categoryArr[0];
	ScategoryInput.value = categoryArr[1];
	companyInput.value = product.company;
	descriptionInput.value = product.description;
	inventoryInput.value = product.inventory;
	priceInput.value = product.price;
	imageView.src = product.imageUrl;
}

addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.

function addAllEvents() {
	addForm.addEventListener('submit', addProudct);
	categroyButton.addEventListener('click', getCategory);
	modalclose.addEventListener('click', closeModal);
	imageInput.addEventListener('change', () => {
		reader.readAsDataURL(imageInput.files[0]);
	});
}

async function getCategory(e) {
	e.preventDefault();
	document.querySelector('.modal_wrap').style.display = 'block';
	document.querySelector('.black_bg').style.display = 'block';

	categorySelectBox.innerHTML = null;

	const categories = await Api.get('/api/categories');
	const Bcategories = await Api.get('/api/Bcategorys');
	let Bcategorys = Object.entries(Bcategories);
	for (let i of Bcategorys) {
		console.log(i[1].name);
		if (!(i[1].name in categories)) {
			categories[i[1].name] = [];
		}
	}
	let categorys = Object.entries(categories);

	const option = document.createElement('option');
	option.textContent = '카테고리를 선택해 주세요.';
	categorySelectBox.append(option);

	Bcategorys.forEach(([key, value]) => {
		const optionItem = document.createElement('option');
		optionItem.value = value.name;
		optionItem.textContent = value.name;
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
}

async function closeModal(e) {
	e.preventDefault();
	document.querySelector('.modal_wrap').style.display = 'none';
	document.querySelector('.black_bg').style.display = 'none';
}

async function categoryReset(targetCategory) {
	const category = document.createElement('div');
	category.classList.add('category-item');
	if (categorysData != undefined) {
		categorysData.forEach((data) => {
			const item = addItem(data);
			category.append(item);
		});
	}
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
		const newCategory = await Api.post('/api/categories', data);
		if (newCategory.result == 'ok') {
			if (categorysData != undefined) {
				categorysData.push(ScateogryInput);
				categoryReset(targetCategory, categorysData);
			}
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
						Api.delete('/api/categories', '', selectedCategory).then(() => {
							li.remove();
							categorysData.forEach((data, index) => {
								if (data === itemName) {
									categorysData.splice(index, 1);
								}
							});
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
			Api.patch('/api/categories', '', data).then(() => {
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
	if (imageInput.files[0]) {
		formData.append(imageInput.name, imageInput.files[0]);
		formData.append('imageKey', product.imageKey)
	}

	const query = location.search;
	const searchURI = new URLSearchParams(query);
	const productId = searchURI.get('productId');

	let object = {};
	formData.forEach(function (value, key) {
		object[key] = value;
	});
	console.log(object);
	swal('상품을 업데이트하시겠습니까?', {
		buttons: {
			cancel: '아니요',
			yes: '네',
		},
	}).then((value) => {
		switch (value) {
			case 'cancel':
				break;
			case 'yes':
				Api.formPatch('/api/products', productId, formData)
					.then((data) => {
						console.log(data)
						swal('상품 업데이트가 완료되었습니다.').then(() => {
							location.href = '/admin';
						});
					})
					.catch((err) => {
						alert(err.message);
					});
		}
	});
}