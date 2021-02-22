var jwt = require("jsonwebtoken");

const config = require("../../../../config/auth.config.js");
const db = require("../../../../models");

const AdminUser = db.adminuser;

/**
 * Signig for admin user.
 *
 * @param object req
 * @return object res
 */
exports.signin = (req, res) => {
	AdminUser.findOne({
    where: {
      email: req.body.email
    }
  }).then(user => {
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }
  })
  .catch(err => {
    res.status(500).send({ message: err.message });
  });
}
