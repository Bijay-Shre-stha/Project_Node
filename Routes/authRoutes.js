const { renderRegisterForm, registerUser, renderLoginForm, loginUser } = require("../controller/auth/authController");
const { logout } = require("../middleWare/authentication");

const router = require("express").Router()

router.route("/register").get(renderRegisterForm).post(registerUser)

router.route("/login").get(renderLoginForm).post(loginUser)

router.route("/logout").get(logout)

module.exports = router;