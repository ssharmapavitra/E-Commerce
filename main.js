const express = require("express");
const session = require("express-session");
const fs = require("fs");
const multer = require("multer");
const checkAuth = require("./middleware/checkAuth");
const sendEmail = require("./methods/sendEmail");

const app = express();
const port = 3000;

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
app.set("view engine", "ejs");

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
	.post((req, res) => {
		let obj = req.body;
		fs.readFile("./db.txt", "utf-8", (err, data) => {
			if (err) {
				res.render("login", { error: "Users not found" });
				return;
			}
			data = JSON.parse(data);
			if (obj.username in data && data[obj.username].password == obj.password) {
				//check if email is verified
				if (!data[obj.username].isVerified) {
					res.render("login", { error: "Email not verified" });
					return;
				}

				//set session
				req.session.is_logged_in = true;
				req.session.name = data[obj.username].name;
				req.session.username = data[obj.username].username;
				console.log(req.session);
				res.redirect("/home");
				return;
			} else {
				res.render("login", { error: "Invalid Credentials" });
			}
		});
	});

//Route SignUp
app
	.route("/signup")
	.get((req, res) => {
		res.render("signup", { error: "" });
	})
	.post((req, res) => {
		let obj = req.body;
		//Add Token
		obj.mailToken = Date.now(); //Change this to uuid or something else
		obj.isVerified = false;
		fs.readFile("db.txt", "utf-8", (err, data) => {
			if (err) {
				res.render("signup", { error: "Users not Found" });
				return;
			}

			let users = [];
			if (data.length > 0 && data[0] === "{" && data[data.length - 1] === "}") {
				users = JSON.parse(data);
			} else users = {};

			if (obj.username in users) {
				res.render("signup", { error: "Username already exist" });
				return;
			} else {
				users[obj.username] = obj;
				fs.writeFile("./db.txt", JSON.stringify(users), (err) => {
					if (err) {
						res.render("signup", { error: "Something Went Wrong" });
						return;
					}
					sendEmail.sendSignUpMail(
						obj.username,
						obj.mailToken,
						obj.name,
						(err, data) => {
							if (err) {
								console.log(err);
								res.render("signup", { error: "Something Went Wrong" });
								return;
							}
							console.log(data);
							res.redirect("/login");
						}
					);
				});
			}
		});
	});

//Route Verify
app.get("/verifyemail/:username/:token", (req, res) => {
	let username = req.params.username;
	let token = req.params.token;
	fs.readFile("db.txt", "utf-8", (err, data) => {
		if (err) {
			res.render("signup", { error: "Users not Found" });
			return;
		}
		let users = [];
		if (data.length > 0 && data[0] === "{" && data[data.length - 1] === "}") {
			users = JSON.parse(data);
		} else users = {};
		//if username is already verified
		if (users[username].isVerified) {
		}
		if (username in users && users[username].mailToken == token) {
			users[username].isVerified = true;
			fs.writeFile("./db.txt", JSON.stringify(users), (err) => {
				if (err) {
					res.render("signup", { error: "Something Went Wrong" });
					return;
				}
				res.redirect("/login");
			});
		} else {
			res.render("signup", { error: "Invalid Token" });
		}
	});
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
		fs.readFile("db.txt", "utf-8", (err, data) => {
			if (err) {
				res.render("resetpassword", { error: "Users not Found" });
				return;
			}
			let users = [];
			if (data.length > 0 && data[0] === "{" && data[data.length - 1] === "}") {
				users = JSON.parse(data);
			} else users = {};
			if (obj.username in users) {
				//write new password to db
				users[obj.username].password = obj.password;
				fs.writeFile("./db.txt", JSON.stringify(users), (err) => {
					if (err) {
						res.render("signup", { error: "Something Went Wrong" });
						return;
					}
					//send mail
					sendEmail.sendPasswordChangedMail(
						obj.username,
						users[obj.username].mailToken,
						users[obj.username].name,
						(err, data) => {
							if (err) {
								console.log(err);
								res.render("resetpassword", { error: "Something Went Wrong" });
								return;
							}
							// console.log(data);
							res.redirect("/login");
						}
					);
				});
			} else {
				res.render("Login", { error: "User Not found" });
			}
		});
	});

//Forgot Password
app
	.route("/forgotpassword")
	.get((req, res) => {
		res.render("forgotpassword", { error: "" });
	})
	.post((req, res) => {
		let obj = req.body;
		fs.readFile("./db.txt", "utf-8", (err, data) => {
			if (err) {
				res.render("forgotpassword", { error: "Users not found" });
				return;
			}
			data = JSON.parse(data);
			if (obj.username in data) {
				//check if email is verified
				if (!data[obj.username].isVerified) {
					res.render("forgotpassword", { error: "Email not verified" });
					return;
				}
				//set forgot password token
				data[obj.username].forgotPasswordToken = Date.now();
				fs.writeFile("./db.txt", JSON.stringify(data), (err) => {
					if (err) {
						res.render("forgotpassword", { error: "Something Went Wrong" });
						return;
					}
					//send mail
					sendEmail.sendForgotPasswordMail(
						obj.username,
						data[obj.username].forgotPasswordToken,
						data[obj.username].name,
						(err, message) => {
							if (err) {
								console.log(err);
								res.render("forgotpassword", { error: "Something Went Wrong" });
								return;
							}
							console.log(message);
							res.redirect("/login");
						}
					);
				});
			} else {
				res.render("forgotpassword", { error: "User Not found" });
			}
		});
	});

app.get("/resetpassword/:username/:token", (req, res) => {
	let username = req.params.username;
	let token = req.params.token;
	fs.readFile("db.txt", "utf-8", (err, data) => {
		if (err) {
			res.render("login", { error: "Users not Found" });
			return;
		}
		let users = {};
		if (data.length > 0 && data[0] === "{" && data[data.length - 1] === "}") {
			users = JSON.parse(data);
		}

		if (username in users) {
			//Check Token
			if (users[username].forgotPasswordToken == token) {
				req.session.username = username;
				res.render("resetpassword", { error: "" });
			}
		} else {
			res.render("Login", { error: "User Not found" });
		}
	});
});

///
app.get("/home", checkAuth, (req, res) => {
	res.render("index", { name: req.session.name, login: true });
});

app.get("/logout", (req, res) => {
	req.session.is_logged_in = false;
	req.session.name = "";
	res.redirect("/");
});

app.route("/products").get((req, res) => {
	res.render("products", { name: req.session.name, login: true });
});

app.get("/getProducts", (req, res) => {
	// console.log("getProducts");
	fs.readFile("./product.txt", "utf-8", (err, data) => {
		if (err) {
			console.log(err);
			res.sendStatus(404);
			return;
		}
		res.send(data);
	});
});

app.get("*", (req, res) => {
	res.sendStatus(404);
});

app.listen(port, () => {
	console.log("Listening at port : " + port);
});

//Function to read data from file
function readData(err, callback) {
	fs.readFile("db.txt", "utf-8", (err, data) => {
		if (err) {
			err();
			return;
		}
		let users = {};
		if (data.length > 0 && data[0] === "{" && data[data.length - 1] === "}") {
			users = JSON.parse(data);
		}
		callback(users);
	});
}

//Function to write data to file
function writeData(users, callback) {
	fs.writeFile("./db.txt", JSON.stringify(users), (err) => {
		if (err) {
			callback(err);
			return;
		}
		callback();
	});
}

//Session Schema
// {
// 	"session": {
//	 	is_logged_in: true,
//	 	name: "Rahul",
// 	},
// 		}
