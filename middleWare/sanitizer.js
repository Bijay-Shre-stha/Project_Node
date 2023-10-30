const sanitizeHtml = require("sanitize-html")

const sanitizer = (req, res, next) => {
    for (const key in req.body) {
        req.body[key] = sanitizeHtml(req.body[key],{
            allowedTags: [],
            allowedAttributes: {}
        })
    }
    next()
}
module.exports = sanitizer
