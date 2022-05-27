import * as Api from '/api.js';

const toTopEl = document.getElementById('to-top');
const inputProduct = document.getElementById('inputProduct');

const rankedproducts = await Api.get('/api/rankedproducts');
console.log(rankedproducts);

for (let i = 0; i < rankedproducts.length; i++) {
	let image = rankedproducts[i].imageUrl;
	let seller = rankedproducts[i].company;
	let productDescription = rankedproducts[i].name;
	let price = rankedproducts[i].price;
	//원화 변경
	let priceKRW = price.toLocaleString('ko-KR');

	inputProduct.innerHTML += `<div class="product-item" id="product-item">
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

// 상단으로 가는 버튼
toTopEl.addEventListener('click', function () {
	gsap.to(window, 0.7, {
		scrollTo: 0,
	});
});
