const express = require('express')
const app = express()

require('dotenv').config() 

const cookieParser = require("cookie-parser")

const blogRoutes = require("./Routes/blogRoutes.js")

const authRoute = require("./Routes/authRoutes")

const rateLimit = require("express-rate-limit")

//require session
const session = require("express-session")

//require connect-flash
const flash = require("connect-flash")

// database connection 
require("./modal/index.js")

// telling the nodejs to set view-engine to ejs
app.set('view engine', 'ejs')

// telling the nodejs to use static files
app.use(express.static("./Public/css"))
app.use(express.static("uploads/"))


app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(flash())
app.use(session({
    secret: process.env.SECRET__SESSION,
    resave: false,
    saveUninitialized: false,
}))

//limiting the request
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 2 ,// limit each IP to 100 requests per windowMs
    message: "Too many requested for forget password try again after 30 mins"

});
app.use("/forgotPassword",limiter)

app.use((req,res,next)=>{
    res.locals.currentUser = req.cookies.token
    next()
})


app.use("", blogRoutes)

app.use("", authRoute)


app.listen(3000, () => {
    console.log("NodeJs project has started at port 3000")
}) 
//!helmet