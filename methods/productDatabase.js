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

// add to cart
async function addToCart(product_id, cart_id) {
	const result = await prod_pool.query(
		`INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, 1)`,
		[cart_id, product_id]
	);
	return result[0];
}

//increase quantity
async function updateQuantity(product_id, cart_id, quantityToAdd) {
	const result = await prod_pool.query(
		`UPDATE cart_items SET quantity = quantity + ? WHERE cart_id = ? AND product_id = ?`,
		[quantityToAdd, cart_id, product_id]
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

module.exports = {
	getProductsFromDatabase,
	getCartId,
	addToCart,
	updateQuantity,
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
