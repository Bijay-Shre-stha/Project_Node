const sanitizeHtml = require("sanitize-html")

const sanitizer = (req, res, next) => {
    for (const key in req.body) {
        req.body[key] = sanitizeHtml(req.body[key])
    }
    next()
}
module.exports = sanitizer
