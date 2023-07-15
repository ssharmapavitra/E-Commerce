function checkAdminAuth(req, res, next) {
	// console.log(req.session.admin_is_logged_in);
	if (req.session.admin_is_logged_in) {
		next();
		return;
	}
	res.redirect("/admin/login");
}

module.exports = checkAdminAuth;
