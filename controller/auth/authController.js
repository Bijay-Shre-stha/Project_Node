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
    res.render("login")
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
            console.log(token);
            const script = `
            <script>
                alert("Login Successfully");
                window.location.href = "/";
            </script>
            `;
            res.send(script);
        } else {
            res.send("Incorrect password. Please provide the correct password.")
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
            email: email
        }
    })
    if (userData.length == 0) {
        return res.send("user with that email doesn't exit")
    }
    else {
        const currentTime = Date.now()
        const otpTime = userData[0].otpGenerated
        if (currentTime - otpTime <= 120000) {
            if (userData[0].otp == otp) {
                res.redirect("/resetPassword?email=" + email)
            }
            else {
                res.send("invalid otp")
            }
        }
        else {
            res.send("otp expired")
        }
        //  res.send("valid")
    }
}

exports.resetPassword = async (req, res) => {
    const email = req.query.email
    res.render("resetPassword", {
        email: email
    })
}
