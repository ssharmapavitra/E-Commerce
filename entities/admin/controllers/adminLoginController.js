const adminDb = require("../../../methods/adminDatabase");

function loginPage(req, res) {
	if (req.session.admin_is_logged_in) {
		res.redirect("/admin");
		return;
	}
	res.render("adminLogin", { error: "" });
}

async function loginAdmin(req, res) {
	let obj = req.body;
	let admin = await adminDb.getAdminFromDatabase(obj.username);
	if (admin) {
		if (admin.password == obj.password) {
			req.session.admin_name = admin.name;
			req.session.admin_is_logged_in = true;
			req.session.admin_username = admin.username;
			res.redirect("/admin");
			return;
		}
	}
	res.render("adminLogin", { error: "Invalid Credentials" });
}

//Logout Admin
function logoutAdmin(req, res) {
	req.session.admin_is_logged_in = false;
	req.session.admin_name = "";
	req.session.admin_username = "";
	res.redirect("/admin/login");
}

module.exports = { loginPage, loginAdmin, logoutAdmin };
