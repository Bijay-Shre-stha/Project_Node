const router = require("express").Router();
const { renderCreateBlog, createBlog, allBlogs, readMore, deleteBlog, renderEditBlog, editBlog, renderMyBlogs } = require("../controller/blog/blogController");
const { isAuthenticated } = require("../middleWare/authentication"); 

const { multer, storage } = require("../middleWare/multerController");
const catchError = require("../services/catchError");
const upload = multer({ storage: storage });

router.route("/").get(catchError( isAuthenticated),allBlogs);
router.route("/create").get(renderCreateBlog).post(catchError( isAuthenticated),upload.single("image"), createBlog);
router.route("/note/:id").get(catchError( isAuthenticated),readMore);
router.route("/delete/:id").get(catchError( isAuthenticated),deleteBlog)
router.route("/edit/:id").post(catchError( isAuthenticated), upload.single("image"),editBlog);
router.route("/edit/:id").get(catchError( isAuthenticated),renderEditBlog)
router.route("/myBlogs").get(catchError( isAuthenticated),renderMyBlogs)

module.exports = router;