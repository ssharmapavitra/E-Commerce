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
		//update total price and quantity
		let totalPricePara = document.getElementById("total-price");
		let quantityPara = document.getElementById(`quantity${cart_item_id}`);
		let pricePara = document.getElementById(`price${cart_item_id}`);
		let itemTotalPrice = document.getElementById(
			`item-total-price${cart_item_id}`
		);
		let priceValue = pricePara.innerHTML;
		let quantityValue = quantityPara.innerHTML;
		let totalPrice = totalPricePara.innerHTML;
		let itemTotalPriceValue = parseFloat(itemTotalPrice.innerHTML);
		totalPrice =
			parseFloat(totalPrice) + parseFloat(priceValue) * parseFloat(quantity);
		totalPricePara.innerHTML = totalPrice;
		itemTotalPriceValue += parseFloat(priceValue) * parseFloat(quantity);
		itemTotalPrice.innerHTML = itemTotalPriceValue;
		quantityPara.innerHTML = parseInt(quantityValue) + parseInt(quantity);
	});
}

// //update values when quantity changes
// function quantityChange(cart_item_id, quantity) {
// }
