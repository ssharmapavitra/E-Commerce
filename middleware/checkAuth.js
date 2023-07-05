function checkAuth(req, res, next) {
	if (req.session.is_logged_in) {
		console.log("check");
		next();
		return;
	}
	res.redirect("/login");
}

module.exports = checkAuth;
