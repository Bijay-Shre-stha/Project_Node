const { users } = require("../../modal")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

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
            return res.send("Login Successful")
        } else {
            return res.send("Incorrect password. Please provide the correct password.")
        }
    }
}
