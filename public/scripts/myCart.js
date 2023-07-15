let cartId = "";

//Get Cart Id
function getCartId() {
	let request = new XMLHttpRequest();
	request.open("GET", "/getCartId");
	request.send();
	request.addEventListener("load", () => {
		cartId = JSON.parse(request.responseText);
	});
}

function updateQuantity(cart_item_id, quantity) {
	let request = new XMLHttpRequest();
	request.open("GET", `/updateQuantity/${cart_item_id}/${quantity}`);
	request.send();
	request.addEventListener("load", () => {
		// let data = JSON.parse(request.responseText);
		quantityChange(cart_item_id, quantity);
	});
}

//update values when quantity changes
function quantityChange(cart_item_id, quantity) {
	console.log(quantity, typeof quantity);
	quantity = parseInt(quantity);
	console.log(quantity, typeof quantity);

	//get all the required elements
	let totalPricePara = document.getElementById("total-price");
	let quantityPara = document.getElementById(`quantity${cart_item_id}`);
	let pricePara = document.getElementById(`price${cart_item_id}`);
	let itemTotalPrice = document.getElementById(
		`item-total-price${cart_item_id}`
	);

	//get the values
	let priceValue = parseFloat(pricePara.innerHTML);
	let quantityValue = parseFloat(quantityPara.innerHTML);
	let totalPrice = parseFloat(totalPricePara.innerHTML);
	let itemTotalPriceValue = parseFloat(itemTotalPrice.innerHTML);

	//update the values
	totalPrice = totalPrice + priceValue * quantity;
	itemTotalPriceValue += priceValue * quantity;
	quantityValue += quantity;

	if (quantityValue == 0) {
		let item = document.getElementById(`card${cart_item_id}`);
		item.parentNode.removeChild(item);
	}

	totalPricePara.innerHTML = totalPrice.toFixed(2);
	itemTotalPrice.innerHTML = itemTotalPriceValue.toFixed(2);
	quantityPara.innerHTML = quantityValue;
}
