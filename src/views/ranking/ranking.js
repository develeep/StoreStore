import * as Api from '/api.js';
import { getElement, getElementAll, createElement,addCommas } from '/useful-functions.js'

const inputProduct = document.getElementById('inputProduct');
console.log(rankedproducts);
let limit = 0;

addAllElements();

async function addAllElements() {
	makeRank();
}
const intersectionoObserver = new IntersectionObserver(async (entries)=>{
	if(entries.some(entry=>entry.intersectionRatio > 0)){
		await makeRank();
		entries[0].target.remove();
	}
})

const testObserve = new IntersectionObserver(
	(entries) => {
			console.log(entries.isIntersecting)
			console.log((entries.intersectionRatio * 100).toFixed(2))
		},
	{
		threshold: [...new Array(1000).fill(0).map((_, i) => i * 0.001), 1]
	}
);

// 상단으로 가는 버튼
const toTopEl = document.getElementById('to-top');
toTopEl.addEventListener('click', function () {
	window.scrollTo({
		top: 0,
		behavior: 'smooth',
	});
});
async function getProducts(limit) {
	return await Api.getItem(`/api/rankednextproducts?page=${limit}`);
}

async function makeRank() {
	
	const getProductsList = await getProducts(limit++)
	const getProductCategory = [...getProductsList]

	console.log(limit)
	if (getProductCategory.length === 0) {
		inputProduct.append(renderNoneCategory())
	} else {

		const inputProductBox = createElement('div')
		inputProductBox.classList.add('inputProduct')

		getProductCategory.forEach((product,index)=>{
			const item = renderProductItem(product)
			inputProductBox.append(item)
		})
		inputProduct.append(inputProductBox)
		
		const lodingBox = createElement('div')
		lodingBox.id = 'loading-box'
		const loding = createElement('div')
		loding.classList.add('lds-ring')
		const div = createElement('div')
		
		loding.append(div,div,div,div)
		lodingBox.append(loding)
		inputProduct.appendChild(lodingBox)
		
		intersectionoObserver.observe(lodingBox)
		testObserve.observe(inputProductBox)
	}
}

function renderNoneCategory() {
	const nullBox = createElement('div')
	nullBox.classList.add('nullcategory')
	nullBox.id = 'nullcategory'
	nullBox.textContent = '등록된 상품이 없습니다.'
	return nullBox
}

function renderProductItem(product){

	const productItem = createElement('div')
	productItem.classList.add('product-item')
	productItem.id = 'product-item'

	const imageBox = createElement('div')
	const img = createElement('img')
	imageBox.classList.add('image-box')
	img.id = 'productImage'
	img.alt = product.name
	img.src = product.imageUrl
	imageBox.append(img)
	
	const descriptionBox = createElement('div')
	descriptionBox.classList.add('description')

	const detailBox = createElement('div')
	detailBox.classList.add('detail')

	const seller = createElement('div')
	seller.id = 'seller'
	seller.textContent = product.company;
	const productDescription = createElement('div')
	productDescription.classList.add('productDescription')
	productDescription.textContent = product.name
	detailBox.append(seller,productDescription)


	const priceBox = createElement('div')
	priceBox.classList.add('price')

	const price = createElement('div')
	price.id = 'productPrice'
	price.textContent = `${addCommas(product.price)}원`;
	priceBox.append(price)

	productItem.append

	descriptionBox.append(detailBox,priceBox)
	productItem.append(imageBox,descriptionBox,)

	productItem.addEventListener('click',()=>{
			localStorage.setItem('productId',product.productId); 
			location.href = `/product-detail/${product.productId}`;
	})

	return productItem;
}



