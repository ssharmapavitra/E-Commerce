function checkAuth(req, res, next) {
	if (req.session.is_logged_in) {
		next();
		return;
	} else if (req.session.resetPassword) {
		next();
		return;
	}
	res.redirect("/login");
}

module.exports = checkAuth;
