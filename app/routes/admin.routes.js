const authController = require("../controllers/api/v1/admin/AuthController");

module.exports = function(app) {
	app.post("/api/auth/signin", authController.signin);
}