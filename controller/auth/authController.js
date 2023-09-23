const { users } = require("../../modal")
const bcrypt = require("bcryptjs")

exports.renderRegisterForm = (req, res) => {
    res.render("register")
}

exports.registerUser = async (req, res) => {
    
    const { email, username, password, confirmPassword } = req.body

    if (password !== confirmPassword) {
        res.send("Password and confirmPassword doesn't matched")
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


// LOGIN Starts from here

exports.renderLoginForm = (req, res) => {
    res.render("login")
}

exports.loginUser = (req, res) => {
    console.log(req.body)
    res.redirect("/")
}