const { renderRegisterForm, registerUser, renderLoginForm, loginUser, renderLogout, forgetPassword, checkForgetPassword, otp, handleOtp, resetPassword, handlePasswordChange, } = require("../controller/auth/authController");

const router = require("express").Router()

router.route("/register").get(renderRegisterForm).post(registerUser)

router.route("/login").get(renderLoginForm).post(loginUser)

router.route("/logout").get(renderLogout)

router.route("/forgotPassword").get(forgetPassword).post(checkForgetPassword)

router.route("/otp").get(otp)

router.route("/otp/:id").post(handleOtp)

router.route("/resetPassword").get(resetPassword)

router.route("/resetPassword/:email/:otp").post(handlePasswordChange)

module.exports = router;