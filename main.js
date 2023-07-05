const express = require("express");
const session = require("express-session");
const fs = require("fs");
const multer = require("multer");
const checkAuth = require("./middleware/checkAuth");
const { error } = require("console");
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
	res.redirect("/home");
	// res.render("index", { name: "", login: false });
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
				req.session.is_logged_in = true;
				req.session.name = data[obj.username].name;
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
					res.redirect("/login");
				});
			}
		});
	});

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
