const { renderRegisterForm, registerUser, renderLoginForm, loginUser, renderLogout, forgetPassword, checkForgetPassword, otp, handleOtp, resetPassword, handlePasswordChange, } = require("../controller/auth/authController");
const catchError = require("../services/catchError");

const router = require("express").Router()

router.route("/register").get(renderRegisterForm).post(catchError(registerUser))

router.route("/login").get(renderLoginForm).post(catchError(loginUser))

router.route("/logout").get(catchError( renderLogout))

router.route("/forgotPassword").get(catchError(forgetPassword)).post(catchError(checkForgetPassword))

router.route("/otp").get(catchError(otp))

router.route("/otp/:id").post(catchError(handleOtp))

router.route("/resetPassword").get(catchError(resetPassword))

router.route("/resetPassword/:email/:otp").post(catchError(handlePasswordChange))

module.exports = router;