import * as Api from '/api.js';

const inputProduct = document.getElementById('inputProduct');
const inputNewestproduct = document.getElementById('inputNewestproduct');

const newestproducts = await Api.get('/api/newestproducts');
// console.log(newestproducts);

addAllElements();

async function addAllElements() {
	makeRank();
}

function makeRank() {
	if (newestproducts.length === 0) {
		inputNewestproduct.innerHTML += `<div class="nullcategory" id="nullcategory">등록된 상품이 없습니다.</div>`;
	} else {
		for (let i = 0; i < newestproducts.length; i++) {
			const image = newestproducts[i].imageUrl;
			const seller = newestproducts[i].company;
			const productDescription = newestproducts[i].name;
			const price = newestproducts[i].price;
			const productId = newestproducts[i].productId;
			//원화 변경
			const priceKRW = price.toLocaleString('ko-KR');

			// onclick = localStorage.setItem('productId',productId); location.href = '/product-detail'
			inputProduct.innerHTML += `<div onclick="localStorage.setItem('productId','${productId}'); 
			location.href = '/product-detail/${productId}';" class="product-item" id="product-item">
		<div class="image-box">
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
}
