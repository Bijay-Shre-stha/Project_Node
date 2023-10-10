module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((err) => {
            const path = req.route.path
            req.flash("error","something went wrong")
            res.redirect(path)
        })
    }
}