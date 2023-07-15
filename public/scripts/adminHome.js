//AJAX request to get products
let indexLoad = 1;
const products_list = [];
let cartId = 0;

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
			<button onclick="viewProduct('${product.id}')">View Details</button>
            <button id=editProduct${product.id} onclick="EditProduct('${product.id}')">Edit Product</button>
        </div>
        `;
		productContainer.appendChild(div);
	});
}

//View product open popup
function viewProduct(id) {
	let product = products_list.find((product) => product.id == id);
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
				<button id=editProduct${product.id} onclick="EditProduct('${product.id}')">Edit Product</button>
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

//Add new product
function AddNewProduct() {
	let display = document.getElementById("display");
	display.style.display = "none";
	let productForm = document.getElementById("productForm");
	productForm.style.display = "flex";
	productForm.innerHTML = `
	<button id="closeProductFrom" onclick="closeProductForm()">X</button>
				<form
					id="productAddForm"
					action="/admin/addNewProduct"
					method="POST"
					enctype="multipart/form-data"
				>
					<input
						id="name"
						type="text"
						name="name"
						placeholder="Enter Product Name"
						required
					/>
					<input
						id="description"
						type="text"
						name="description"
						placeholder="Enter Product Description"
						required
					/>
					<input
						id="rating"
						type="number"
						name="rating"
						placeholder="Rating"
						required
					/>
					<input
						id="price"
						type="text"
						name="price"
						required
						placeholder="Enter Product Price"
					/>
					<label for="category">Choose a category:</label>
					<select id="category" name="category">
						<option value="sample">Sample</option>
						<option value="jeans">Jeans</option>
						<option value="sofa">Sofa</option>
						<option value="t-shirt">T-Shirt</option>
						<option value="tv">TV</option>
					</select>
					<input type="file" name="image" />
					<input id="submit" class="btn" type="submit" value="Add Product" />
				</form>
	`;
}

//Close form
function closeProductForm() {
	let display = document.getElementById("display");
	display.style.display = "block";
	let productForm = document.getElementById("productForm");
	productForm.style.display = "none";
}

//Edit product
function EditProduct(id) {
	AddNewProduct();
	let product = products_list.find((product) => product.id == id);
	//Fill form with product details
	document.getElementById("name").value = product.name;
	document.getElementById("description").value = product.description;
	document.getElementById("price").value = product.price;
	document.getElementById("rating").value = product.rating;
	document.getElementById("category").value = "sample";

	//Change button text
	let submitBtn = document.getElementById("submit");
	submitBtn.value = "Update Product";

	//Change form action
	let form = document.getElementById("productAddForm");
	form.action = `admin/updateProduct/${product.id}`;

	//Add delete button
	let deleteBtn = document.createElement("button");
	deleteBtn.id = "delete";
	deleteBtn.innerHTML = "Delete Product";
	deleteBtn.onclick = () => {
		deleteProduct(product.id);
	};
	let productForm = document.getElementById("productForm");
	productForm.appendChild(deleteBtn);
}

//Delete product
function deleteProduct(id) {
	let request = new XMLHttpRequest();
	request.open("DELETE", `/admin/deleteProduct/${id}`);
	request.send();
	request.onload = () => {
		location.reload();
	};
}
