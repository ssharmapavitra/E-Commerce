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

//get admin
async function getAdminFromDatabase(adminUsername) {
	try {
		const result = await prod_pool.query(
			`SELECT * FROM admins WHERE username=?`,
			[adminUsername]
		);
		return result[0][0];
	} catch (error) {
		console.log(error);
	}
}

module.exports = {
	getAdminFromDatabase,
};
