import * as Api from '/api.js';

const toTopEl = document.getElementById('to-top');
const inputProduct = document.getElementById('inputProduct');

const rankedproducts = await Api.get('/api/rankedproducts');
console.log(rankedproducts);

makeRank();

// 상단으로 가는 버튼
toTopEl.addEventListener('click', function () {
	gsap.to(window, 0.7, {
		scrollTo: 0,
	});
});

function makeRank() {
	for (let i = 0; i < rankedproducts.length; i++) {
		const image = rankedproducts[i].imageUrl;
		const seller = rankedproducts[i].company;
		const productDescription = rankedproducts[i].name;
		const price = rankedproducts[i].price;
		const productId = rankedproducts[i].productId;
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

