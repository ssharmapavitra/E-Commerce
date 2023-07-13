//AJAX request to get products
let indexLoad = 1;
const products_list = [];

function onLoad() {
	getProducts();
}

//AJAX request to get products
function getProducts() {
	let request = new XMLHttpRequest();
	request.open("GET", `/getProducts/${indexLoad}`);
	request.send();
	request.onload = () => {
		let products = JSON.parse(request.responseText);
		products_list.push(...products);
		addProducts(products);
	};
}

//Adding n number of products to list
function addProducts(products) {
	let productContainer = document.getElementById("product-container");
	products.forEach((product) => {
		let div = document.createElement("div");
		div.classList.add("product");
		div.innerHTML = `
        <img class="product-image" src="${product.thumbnailPath}" alt="product" />
        <div class="product-info">
            <h3>${product.name}</h3>
			<button onclick="viewProduct('${product.id}')">View</button>
            <button onclick="addToCart('${product.id}')">Add to Cart</button>
        </div>
        `;
		productContainer.appendChild(div);
	});
}

//View product open popup
function viewProduct(id) {
	console.log(id);
	let product = products_list.find((product) => product.id == id);
	console.log(product);
	let popup = document.getElementById("popup");
	popup.style.display = "flex";
	let productContainer = document.getElementById("product-container");
	productContainer.style.filter = "blur(5px)";
	popup.innerHTML = `
	<div class="popup-content">
		<div class="popup-header">
			<h2>${product.name}</h2>
			<button onclick="closePopup()">X</button>
		</div>
		<div class="popup-body">
			<img class="product-image" src="${product.imagePath}" alt="product" />
			<div class="popup-info">
				<p>${product.description}</p>
				<p>Price: ${product.price}</p>
				<button onclick="addToCart('${product.id}')">Add to Cart</button>
			</div>
		</div>
	</div>
	`;
}

//Close popup
function closePopup() {
	let popup = document.getElementById("popup");
	popup.style.display = "none";
	let productContainer = document.getElementById("product-container");
	productContainer.style.filter = "blur(0px)";
}

//Load more
function loadMore() {
	indexLoad++;
	if (indexLoad > 5) {
		let loadMoreBtn = document.getElementById("load-more");
		loadMoreBtn.style.display = "none";
	}

	getProducts();
}
