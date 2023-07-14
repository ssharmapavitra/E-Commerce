const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

const prod_pool = mysql
	.createPool({
		host: process.env.MYSQL_HOST,
		user: process.env.MYSQL_USER,
		password: process.env.MYSQL_PASSWORD,
		database: process.env.MYSQL_DATABASE,
	})
	.promise();

//get products
async function getProductsFromDatabase(indexLoad) {
	let j = 5; //size of array;
	let i = (indexLoad - 1) * j;
	const result = await prod_pool.query(
		`
          SELECT *
          FROM products
          LIMIT ?
          OFFSET ?
        `,
		[j, i]
	);
	return result[0];
}

//get product from id
async function getProductFromId(id) {
	const result = await prod_pool.query(`SELECT * FROM products WHERE id = ?`, [
		id,
	]);
	return result[0];
}

// add to cart
async function addToCart(product_id, cart_id) {
	try {
		const product = await getProductFromId(product_id);
		let price = product[0].price;

		// Check if the product already exists in the cart
		const existingCartItem = await prod_pool.query(
			`SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?`,
			[cart_id, product_id]
		);

		if (existingCartItem[0].length > 0) {
			// If the product exists, update the quantity by incrementing it by 1
			const updatedQuantity = existingCartItem[0][0].quantity + 1;
			const result = await prod_pool.query(
				`UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_id = ?`,
				[updatedQuantity, cart_id, product_id]
			);
			return updatedQuantity;
		} else {
			// If the product doesn't exist, insert a new cart item with quantity 1
			const result = await prod_pool.query(
				`INSERT INTO cart_items (cart_id, product_id, quantity, price) VALUES (?, ?, 1, ?)`,
				[cart_id, product_id, price]
			);
			return 1;
		}
	} catch (error) {
		console.log(error);
	}
}

//increase quantity
async function updateQuantity(cart_item_id, quantityToAdd) {

	// Check if the product should be removed from the cart
	if (quantityToAdd == -1) {
		const prod = await prod_pool.query(
			`SELECT * FROM cart_items WHERE cart_item_id = ?`,
			[cart_item_id]
		);
		if (prod[0][0].quantity == 1) {
			const result = await prod_pool.query(
				`DELETE FROM cart_items WHERE cart_item_id = ?`,
				[cart_item_id]
			);
			return result[0];
		}
	}
	const result = await prod_pool.query(
		`UPDATE cart_items SET quantity = quantity + ? WHERE cart_item_id = ?`,
		[quantityToAdd, cart_item_id]
	);
	return result[0];
}

//get cart id
async function getCartId(username) {
	try {
		console.log(username);
		const result = await prod_pool.query(
			`SELECT cart_id FROM cart WHERE user_id = (SELECT user_id FROM users WHERE username = ?)`,
			[username]
		);
		console.log(result[0][0].cart_id);
		return result[0][0].cart_id;
	} catch (error) {
		console.log(error);
	}
}

//get cart items
async function getCartItems(username) {
	try {
		const cart_id = await getCartId(username);
		const result = await prod_pool.query(
			`SELECT * FROM cart_items INNER JOIN products WHERE cart_id = ? and cart_items.product_id = products.id`,
			[cart_id]
		);
		console.log("items", result[0]); // array of cart items
		return result[0];
	} catch (error) {
		console.log(error);
	}
}

module.exports = {
	getProductsFromDatabase,
	getCartId,
	addToCart,
	updateQuantity,
	getCartItems,
};

/*





-------------Test-------------

// getProductsFromDatabase(3);


----------Schema---------------
 `id` INT UNSIGNED NOT NULL PRIMARY KEY UNIQUE_KEY AUTO_INCREMENT,
    `name` VARCHAR(45) NOT NULL,
    `description` VARCHAR(200),
    `rating` INT,
    `thumbnailPath` VARCHAR(45),
    `imagePath` VARCHAR(45),
    `price` DOUBLE NOT NULL,
    `category_id` INT
    

async function getProducts() {
  const result = await pool.query(`SELECT * FROM products`);
  let productList = result[0];
  
  // Define the starting and ending index
  let i = 2; // Starting index
  let j = 6; // Ending index (inclusive)
  
  // Get subarray from ith to jth index
  productList = productList.slice(i, j + 1);
  
  console.log(productList);
}


*/
