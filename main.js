const express = require("express");
const session = require("express-session");
const fs = require("fs");
const multer = require("multer");
const checkAuth = require("./middleware/checkAuth");
const sendEmail = require("./methods/sendEmail");
const db = require("./methods/database");
const prodb = require("./methods/productDatabase");

const app = express();
const port = 3000;

//View Engine
app.set("view engine", "ejs");

//Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(
	session({
		secret: "keyboard cat",
		resave: false,
		saveUninitialized: true,
		// cookie: { secure: true },
	})
);

/* ---------------------------------Routing ------------------------------ */

app.get("/", (req, res) => {
	// res.redirect("/home");
	if (req.session.is_logged_in) res.redirect("/home");
	else res.render("index", { name: "", login: false });
});

//Route Login
app
	.route("/login")
	.get((req, res) => {
		res.render("login", { error: "" });
	})
	.post(async (req, res) => {
		let obj = req.body;
		let user = await db.getUser(obj.username);
		// console.log(user);
		//check if user exist
		if (!user) {
			res.render("login", { error: "User not found" });
			return;
		}
		//check if password is correct
		if (user.password != obj.password) {
			res.render("login", { error: "Invalid Credentials" });
			return;
		}
		//check if email is verified
		if (!user.is_verified) {
			res.render("login", { error: "Email not verified" });
			return;
		}

		//set session
		req.session.is_logged_in = true;
		req.session.name = user.name;
		req.session.username = user.username;
		// console.log(req.session);
		res.redirect("/home");
		return;
	});

//Route SignUp
app
	.route("/signup")
	.get((req, res) => {
		if (req.session.is_logged_in) res.redirect("/home");
		else res.render("signup", { error: "" });
	})
	.post(async (req, res) => {
		let obj = req.body;
		//Add Token
		obj.token = Date.now(); //Change this to uuid or something else
		obj.is_verified = false;

		//check if user exist
		if (await db.getUser(obj.username)) {
			res.render("signup", { error: "Username already exist" });
			return;
		}

		//set user
		try {
			await db.setUser(obj);
			sendEmail.sendSignUpMail(
				obj.username,
				obj.token,
				obj.name,
				(err, data) => {
					if (err) {
						res.render("signup", { error: "Something Went Wrong" });
						return;
					}
					res.render("signup", { error: "Check your mail" });
					return;
				}
			);
		} catch (err) {
			console.log(err);
			res.render("signup", { error: "Something Went Wrong" });
			return;
		}
	});

//Route Verify
app.get("/verifyemail/:username/:token", async (req, res) => {
	let username = req.params.username;
	let token = req.params.token;

	//get user
	let user = await db.getUser(username);
	if (!user) {
		res.render("signup", { error: "User not found" });
		return;
	}
	//check if user is already verified
	if (user.is_verified || user.token == null) {
		res.render("signup", { error: "User already verified" });
		return;
	}
	//check if token is correct
	if (user.token != token) {
		res.render("signup", { error: "Invalid Token" });
		return;
	}

	//verify user
	try {
		await db.verifyUser(username);
		res.redirect("/login");
		return;
	} catch (err) {
		console.log(err);
		res.render("signup", { error: "Something Went Wrong" });
		return;
	}
});

//Reset Password
app
	.route("/newpassword")
	.get(checkAuth, (req, res) => {
		res.render("resetpassword", { error: "" });
	})
	.post((req, res) => {
		let obj = req.body;
		obj.username = req.session.username;
		if (!obj.username) {
			res.render("signup", { error: "User not found" });
			return;
		}
		//set new password
		try {
			db.setPassword(obj.username, obj.password);
			//send mail
			sendEmail.sendPasswordChangedMail(obj.username, (err, data) => {
				if (err) {
					console.log(err);
					res.render("resetpassword", { error: "Something Went Wrong" });
					return;
				}
				res.redirect("/login");
			});

			res.redirect("/login");
			return;
		} catch (err) {
			console.log(err);
			res.render("login", { error: "Something Went Wrong" });
			return;
		}
	});

//Forgot Password
app
	.route("/forgotpassword")
	.get((req, res) => {
		res.render("forgotpassword", { error: "" });
	})
	.post(async (req, res) => {
		let obj = req.body;
		//check if user exist
		let user = await db.getUser(obj.username);
		if (!user) {
			res.render("forgotpassword", { error: "User not found" });
			return;
		}
		//check if email is verified
		if (!user.is_verified) {
			res.render("forgotpassword", { error: "Email not verified" });
			return;
		}
		//set forgot password token
		try {
			let token = Date.now(); //Change this to uuid or something else
			await db.setToken(obj.username, token);
			//send mail
			sendEmail.sendForgotPasswordMail(obj.username, token, (err, data) => {
				if (err) {
					console.log(err);
					res.render("forgotpassword", { error: "Something Went Wrong" });
					return;
				}
				res.render("forgotpassword", { error: "Check your mail" });
				return;
			});
		} catch (err) {
			console.log(err);
			res.render("forgotpassword", { error: "Something Went Wrong" });
			return;
		}
	});

//Reset Password
app.get("/resetpassword/:username/:token", async (req, res) => {
	let username = req.params.username;
	let token = req.params.token;

	//get user
	let user = await db.getUser(username);
	if (!user) {
		res.render("login", { error: "User not found" });
		return;
	}
	//check token
	if (user.token != token) {
		res.render("login", { error: "Invalid Token" });
		return;
	}

	//set session
	req.session.username = username;

	//verify user
	await db.verifyUser(username);

	res.render("resetpassword", { error: "" });
});

//Home
app.get("/home", checkAuth, (req, res) => {
	res.render("index", { name: req.session.name, login: true });
});

//Logout
app.get("/logout", (req, res) => {
	req.session.is_logged_in = false;
	req.session.name = "";
	res.redirect("/");
});

//Products
app.route("/products").get((req, res) => {
	res.render("products", { name: req.session.name, login: true });
});

//AJAX request to get Products
app.get("/getProducts/:indexLoad", async (req, res) => {
	let data = await prodb.getProductsFromDatabase(req.params.indexLoad);
	res.send(data);
});

app.get("*", (req, res) => {
	res.sendStatus(404);
});

app.listen(port, () => {
	console.log("Listening at port : " + port);
});

/*

---------------------------------------------------------------------------------------------

//Session Schema
// {
// 	"session": {
//	 	is_logged_in: true,
//	 	name: "Rahul",
// 	},
// 		}


*/
