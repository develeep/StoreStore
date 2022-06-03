import {
	getElement,
	getElementAll,
	checkLoginAdmin,
} from '/useful-functions.js';
import * as Api from '/api.js';

const categorySelectBox = getElement('#categorySelectBox');
const categroyButton = getElement('#modal_btn');
const BcategoryInput = getElement('#Bcategory');
const ScategoryInput = getElement('#Scategory');
const ScategoyUl = getElement('#ScategoyUl');
let categorysData = [];
const imageView = document.getElementById('imageViewr');
const addForm = document.getElementById('addForm');
const nameInput = document.getElementById('titleInput');
const categoryInput = document.getElementById('Scategory');
const companyInput = document.getElementById('manufacturerInput');
const descriptionInput = document.getElementById('descriptionInput');
const inventoryInput = document.getElementById('inventoryInput');
const priceInput = document.getElementById('priceInput');
const imageInput = document.getElementById('img');
const reader = new FileReader();
reader.onload = function (e) {
	imageView.src = e.target.result;
};
// const categorySelectBox = document.getElementById('categorySelectBox');
checkLoginAdmin();
addAllElements();
addAllEvents();
var imageFile;
// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
const modalwrap = document.getElementById('modal_btn');

modalwrap.addEventListener('click', async (e) => {});

function addAllEvents() {
	imageInput.addEventListener('change', loadFile);
	addForm.addEventListener('submit', addProudct);
	imageInput.addEventListener('change', () => {
		reader.readAsDataURL(imageInput.files[0]);
	});
}
categroyButton.addEventListener('click', async (e) => {
	e.preventDefault();
	document.querySelector('.modal_wrap').style.display = 'block';
	document.querySelector('.black_bg').style.display = 'block';

	categorySelectBox.innerHTML = null;

	const categories = await Api.get('/api/categories');
	const Bcategories = await Api.get('/api/Bcategorys');
	let Bcategorys = Object.entries(Bcategories);
	for (let i of Bcategorys) {
		console.log(i[1])
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
	const updateInputSubmit = document.createElement('button');
	updateInputSubmit.id = 'updateInputSubmit';
	updateInputSubmit.textContent = '저장';

	const delBtn = document.createElement('button');
	delBtn.id = 'delete';
	const delIcon = document.createElement('i');
	delIcon.classList.add('fa', 'fa-trash');
	delBtn.append(delIcon);


	li.append(btn, updateInput, updateInputSubmit, delBtn);

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

	if (!nameInput.value) {
		swal('이름을 등록해 주세요');
		return;
	}
	if (!categoryInput.value) {
		swal('카테고리를 등록해 주세요');
		return;
	}
	if (!companyInput.value) {
		swal('제조사명을 등록해 주세요');
		return;
	}
	if (!descriptionInput.value) {
		swal('제품 상세를 등록해 주세요');
		return;
	}
	if (!inventoryInput.value) {
		swal('상품수량을 등록해 주세요');
		return;
	}
	if (!priceInput.value) {
		swal('상품가격을 설정해 주세요');
		return;
	}
	if (!imageInput.files[0]) {
		swal('이미지를 등록해 주세요');
		return;
	}

	formData.append(nameInput.name, nameInput.value);
	formData.append(categoryInput.name, categoryInput.value);
	formData.append(companyInput.name, companyInput.value);
	formData.append(descriptionInput.name, descriptionInput.value);
	formData.append(inventoryInput.name, inventoryInput.value);
	formData.append(priceInput.name, priceInput.value);
	formData.append(imageInput.name, imageInput.files[0]);

	let object = {};
	formData.forEach(function (value, key) {
		object[key] = value;
	});
	console.log(object);
	swal('상품을 추가하시겠습니까?', {
		buttons: {
			cancel: '아니요',
			yes: '네',
		},
	}).then((value) => {
		switch (value) {
			case 'cancel':
				break;
			case 'yes':
				Api.formPost('/api/products', formData)
					.then(() => {
						swal('상품 추가가 완료되었습니다.').then(() => {
							location.href = '/admin';
						});
					})
					.catch((err) => {
						alert(err.message);
					});
		}
	});
}
