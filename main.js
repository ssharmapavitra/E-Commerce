const express = require("express");
const multer = require("multer");
const app = express();
const port = 3000;

app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
	res.render("index", { name: "", login: false });
});

app.get("/login", (req, res) => {});

app.listen(port, () => {
	console.log("Listening at port : " + port);
});
