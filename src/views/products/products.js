import * as Api from '/api.js';

//상품 가져오기
const inputProduct = document.getElementById('inputProduct');

let params = location.href.split('/');
params = params[params.length - 2];
// console.log(params);
const getProductCategory = await Api.get(`/api/getProductCategory`, params);

addAllElements();

async function addAllElements() {
	makeCategory();
}

function makeCategory() {
	for (let i = 0; i < getProductCategory.length; i++) {
		const image = getProductCategory[i].imageUrl;
		const seller = getProductCategory[i].company;
		const productDescription = getProductCategory[i].name;
		const price = getProductCategory[i].price;
		const productId = getProductCategory[i].productId;
		//원화 변경
		const priceKRW = price.toLocaleString('ko-KR');

		// onclick = localStorage.setItem('productId',productId); location.href = '/product-detail'
		inputProduct.innerHTML += `<div onclick="localStorage.setItem('productId','${productId}'); 
		  location.href = '/product-detail/${productId}';" class="product-item" id="product-item">
	  <div>
		  <img src="${image}" alt="${productDescription}" id="productImage">
	  </div>
	  <div class="description">
		  <div class="detail">
			  <div id="seller">${seller}</div>
			  <div id="productDescription">${productDescription}</div>
		  </div>
	  <div class="price">
		  <div id="productPrice">${priceKRW}원</div>
	  </div>
	  </div>
	  </div>`;
	}
}
