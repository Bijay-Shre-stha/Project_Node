const express = require('express')
const app = express()

const blogRoutes = require("./Routes/blogRoutes.js")

const authRoute = require("./Routes/authRoutes")

// database connection 
require("./modal/index.js")

// telling the nodejs to set view-engine to ejs
app.set('view engine', 'ejs')

// telling the nodejs to use static files
app.use(express.static("./Public/css"))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use("", blogRoutes)

app.use("", authRoute)


app.listen(3000, () => {
    console.log("NodeJs project has started at port 3000")
})