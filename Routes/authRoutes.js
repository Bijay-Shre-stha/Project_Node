const { renderRegisterForm, registerUser, renderLoginForm, loginUser, renderLogout, forgetPassword, checkForgetPassword, } = require("../controller/auth/authController");

const router = require("express").Router()

router.route("/register").get(renderRegisterForm).post(registerUser)

router.route("/login").get(renderLoginForm).post(loginUser)

router.route("/logout").get(renderLogout)

router.route("/forgotPassword").get(forgetPassword).post(checkForgetPassword)

module.exports = router;