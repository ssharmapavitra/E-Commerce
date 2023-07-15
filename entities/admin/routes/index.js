const express = require("express");
const router = express.Router();
const multer = require("multer");
const prodb = require("../../../methods/productDatabase");

const loginController = require("../controllers/adminLoginController");
const checkAdminAuth = require("../middleware/checkAdminAuth");

// Define the storage configuration for multer
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const category = req.body.category; // Get the category from the request body
		const folderPath = `./public/img/productImg/${category}`; // Create the folder path based on the category
		cb(null, folderPath);
	},
});

const uploadWithCategory = multer({ storage: storage });

// Define the file filter

router.get("/", checkAdminAuth, (req, res) => {
	console.log("Called");
	res.render("adminHome", {
		login: req.session.admin_is_logged_in,
		name: req.session.admin_name,
	});
});

// Route to add new product
router.post(
	"/addNewProduct",
	checkAdminAuth,
	uploadWithCategory.single("image"),
	async (req, res) => {
		const imagePath = `/img/productImg/${req.body.category}/${req.file.filename}`;
		const thumbnailPath = `/img/productImg/${req.body.category}/${req.file.filename}`;
		req.body.imagePath = imagePath;
		req.body.thumbnailPath = thumbnailPath;
		const obj = req.body;
		await prodb.addNewProduct(obj);
		res.redirect("/admin");
	}
);

//Route to update product
router.post(
	"/updateProduct/:id",
	checkAdminAuth,
	uploadWithCategory.single("image"),
	async (req, res) => {
		req.body.id = req.params.id;
		//check if no image is uploaded
		if (!req.file) {
			const obj = req.body;
			await prodb.updateProduct(obj, false);
			res.redirect("/admin");
			return;
		}

		const imagePath = `/img/productImg/${req.body.category}/${req.file.filename}`;
		const thumbnailPath = `/img/productImg/${req.body.category}/${req.file.filename}`;
		req.body.imagePath = imagePath;
		req.body.thumbnailPath = thumbnailPath;
		const obj = req.body;
		await prodb.updateProduct(obj, true);
		res.redirect("/admin");
	}
);

//Route to delete product
router.delete("/deleteProduct/:id", async (req, res) => {
	const id = req.params.id;
	await prodb.deleteProduct(id);
	res.redirect("/admin");
});

// Route to Login
router
	.route("/login")
	.get(loginController.loginPage)
	.post(loginController.loginAdmin);

//logout
router.get("/logout", loginController.logoutAdmin);

router.route("*").get((req, res) => {
	res.send("admin");
});

module.exports = router;
