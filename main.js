const express = require("express");
const fs = require("fs");
const multer = require("multer");
const app = express();
const port = 3000;

app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
	res.render("index", { name: "", login: false });
});

//Route Login
app
	.route("/login")
	.get((req, res) => {
		res.render("login");
	})
	.post((req, res) => {
		res.render("login");
	});

//Route SignUp
app
	.route("/signup")
	.get((req, res) => {
		res.render("signup", { error: "" });
	})
	.post((req, res) => {
		fs.readFile("dbb.txt", "utf-8", (err, data) => {
			if (err) {
				res.render("signup", { error: "Users not Found" });
				return;
			}

			let users = [];
			if (data.length > 0 && data[0] === "{" && data[data.length - 1] === "}") {
			}
		});
	});

app.get("*", (req, res) => {
	res.send(404);
});

app.listen(port, () => {
	console.log("Listening at port : " + port);
});
