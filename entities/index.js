const adminRoutes = require("./admin/routes");

module.exports = (app) => {
	app.use("/admin", adminRoutes);
};
