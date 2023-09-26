const jwt = require("jsonwebtoken")
const { promisify } = require("util")
const { users } = require("../modal")

exports.isAuthenticated = async (req, res, next) => {
    const token = req.cookies.token

    // Check if token given or not 
    if (!token) {
        return res.send("You must be logged In ")
    }

    // Verify token if it is legit or not
    const decoded = await promisify(jwt.verify)(token, process.env.SECRET__KEY)
    // console.log(decoded);
    const userExits = await users.findAll({
        where: {
            id: decoded.id
        }
    })
    if(userExits.length == 0){
        return res.send("User does not exits")
    }
    else{
        req.user = userExits;
        next()
    }
}