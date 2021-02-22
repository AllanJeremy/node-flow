const authController = require("../controllers/api/v1/admin/AuthController");

module.exports = function(app) {
	app.post("/auth/signin", authController.signin);
}