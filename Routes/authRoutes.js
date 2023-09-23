const { renderRegisterForm, registerUser, renderLoginForm, loginUser } = require("../controller/auth/authController");

const router = require("express").Router()

router.route("/register").get(renderRegisterForm).post(registerUser)

router.route("/login").get(renderLoginForm).post(loginUser)

module.exports = router;