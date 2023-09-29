const multer = require("multer");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {

        //logic to get validate file
        const fileType = [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/gif",
            "image/svg+xml",
        ];
        //size if else >=
        if(!fileType.includes(file.mimetype)){
            cb("Error: File type not allowed!");
        }
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

module.exports = {
    multer,
    storage,
};