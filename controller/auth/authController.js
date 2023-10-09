const { users } = require("../../modal")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const sendEmail = require("../../services/sendEmail")

exports.renderRegisterForm = (req, res) => {
    res.render("register")
}

exports.registerUser = async (req, res) => {
    const { email, username, password, confirmPassword } = req.body

    if (password !== confirmPassword) {
        res.send("Password and confirmPassword don't match")
        return
    }

    // INSERT INTO Table(users)
    await users.create({
        email,
        password: bcrypt.hashSync(password, 8),
        username
    })
    res.redirect("/login")
}

exports.renderLoginForm = (req, res) => {
    const error = req.flash("error")
    res.render("login",{error})
}

exports.loginUser = async (req, res) => {
    console.log(req.body)
    const { email, password } = req.body
    if (!email || !password) {
        res.send("Please provide email and password")
        return
    }
    // SELECT * FROM users WHERE email = email
    const userEmailExist = await users.findAll({
        where: {
            email
        }
    })

    if (userEmailExist.length === 0) { // Check if the array is empty
        return res.send("Email not found. Please provide a valid email.")
    } else {
        const userPassword = userEmailExist[0].password
        const isMatched = bcrypt.compareSync(password, userPassword)
        if (isMatched) {
            //token generate
            const token = jwt.sign({
                id: userEmailExist[0].id
            }, process.env.SECRET__KEY, {
                expiresIn: "30d"
            })
            //token send to cookie
            res.cookie("token", token, {
                secure: true,
            })
            // const script = `
            // <script>
            //     alert("Login Successfully");
            //     window.location.href = "/";
            // </script>
            // `;
            // res.send(script);
            req.flash("success", "Login Successfully")
            res.redirect("/")
        } else {
            req.flash("error", "Invalid password")
            res.redirect("/login")
        }
    }
}
exports.renderLogout = (req, res) => {
    res.clearCookie("token");
    res.render("logout");
}

exports.forgetPassword = (req, res) => {
    res.render("forgetPassword")
}
exports.checkForgetPassword = async (req, res) => {
    const email = req.body.email
    if (!email) {
        return res.send("Please provide email")
    }

    const emailExit = await users.findAll({
        where: {
            email: email
        }
    })
    if (emailExit.length == 0) {
        res.send("user with that email doesn't exit")
    }
    else {
        const generatedOtp = Math.floor(10000 * Math.random(9999))
        await sendEmail(
            {
                email: email,
                subject: "forget password",
                otp: generatedOtp
            }
        )

        emailExit[0].otp = generatedOtp
        emailExit[0].otpGenerated = Date.now()
        await emailExit[0].save()
        res.redirect("/otp?email=" + email)
    }
}
exports.otp = async (req, res) => {
    const email = req.query.email
    res.render("otp", {
        email: email
    })
}

exports.handleOtp = async (req, res) => {

    const otp = req.body.otp
    const email = req.params.id
    if (!otp || !email) {
        return res.send("please provide otp")
    }
    const userData = await users.findAll({
        where: {
            email: email,
            otp: otp
        }
    })
    if (userData.length == 0) {
        return res.send("user with that email doesn't exit")
    }
    else {
        const currentTime = Date.now()
        const otpTime = userData[0].otpGenerated
        if (currentTime - otpTime <= 120000) {
            // userData[0].otp = null
            // userData[0].otpGenerated = null
            // await userData[0].save()
            res.redirect(`/resetPassword?email=${email}&otp=${otp}`)
        }
        else {
            res.send("otp expired")
        }
        //  res.send("valid")
    }
}

exports.resetPassword = async (req, res) => {
    const email = req.query.email
    const otp = req.query.otp
    if (!email || !otp) {
        return res.send("please provide email and otp")
    }
    res.render("resetPassword", {
        email: email,
        otp: otp
    })
}

exports.handlePasswordChange = async (req, res) => {
    const email = req.params.email
    const otp = req.params.otp
    console.log(email, otp);
    const newPassword = req.body.newPassword
    const confirmNewPassword = req.body.confirmNewPassword
    if (!newPassword || !confirmNewPassword || !email) {
        return res.send("please provide password and email")
    }
    //check if that email's otp or not
    const userData = await users.findAll({
        where: {
            email: email,
            otp: otp
        }
    })
    if (userData.length == 0) {
        return res.send("user with that email doesn't exit")
    }
    if (newPassword !== confirmNewPassword) {
        return res.send("password and confirm password doesn't match")
    }
    const hashedNewPassword = bcrypt.hashSync(newPassword, 8)


    // const userData = await users.findAll({
    //     where: {
    //         email: email
    //     }
    // })
    // userData[0].password = hashedNewPassword


    await userData[0].save()
    await users.update({
        password: hashedNewPassword
    }, {
        where: {
            email: email
        }
    })
    req.flash("success", "Password Changed and Login successfully")
    res.redirect("/login")
}
