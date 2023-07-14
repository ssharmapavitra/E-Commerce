const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

const pool = mysql
	.createPool({
		host: process.env.MYSQL_HOST,
		user: process.env.MYSQL_USER,
		password: process.env.MYSQL_PASSWORD,
		database: process.env.MYSQL_DATABASE,
	})
	.promise();

//set New User
async function setUser(obj) {
	try {
		const result = await pool.query(`INSERT INTO users SET ?`, [obj]);
		return result[0];
	} catch (error) {
		console.log(error);
		throw error;
	}
}

//verify User
async function verifyUser(username) {
	try {
		const result = await pool.query(
			`UPDATE users SET is_verified=1 ,token=NULL WHERE username=?`,
			[username]
		);
		return result[0];
	} catch (error) {
		console.log(error);
		throw error;
	}
}

//set new password
async function setPassword(username, password) {
	try {
		const result = await pool.query(
			`UPDATE users SET password=? WHERE username=?`,
			[password, username]
		);
		return result[0];
	} catch (error) {
		console.log(error);
		throw error;
	}
}

//get existing User
async function getUser(username) {
	try{
	const result = await pool.query(
		`
    SELECT * FROM users WHERE username=?
    `,
		[username]
	);
	return result[0][0];
	}catch(error){
		console.log(error);
	}
}

//set forgot password token
async function setToken(username, token) {
	try {
		const result = await pool.query(
			`UPDATE users SET token=? WHERE username=?`,
			[token, username]
		);
		return result[0];
	} catch (error) {
		console.log(error);
		throw error;
	}
}

module.exports = { setUser, getUser, verifyUser, setPassword, setToken };

//Test

// let obj = {
// 	username: "test",
// 	password: "test",
// 	name: "test",
// 	mobile: "1234567890",
// 	is_verified: 0,
// 	token: "test",
// };

// // console.log(setUser(obj).catch((err) => console.log(err)));
// getUser("test").catch((err) => console.log(err));

/************************************************************************ */
/*
Schema

user_id int UN AI PK 
username varchar(45) 
password varchar(45) 
name varchar(45) 
mobile varchar(10) 
is_verified tinyint 
token varchar(45)


TRIGGER
CREATE DEFINER=`root`@`localhost` TRIGGER `users_AFTER_INSERT` AFTER INSERT ON `users` FOR EACH ROW BEGIN
	INSERT INTO cart (user_id) VALUES(NEW.user_id);
END
*/
