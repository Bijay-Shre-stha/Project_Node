const router = require("express").Router();
const { renderCreateBlog, createBlog, allBlogs, readMore, deleteBlog, renderEditBlog, editBlog, renderMyBlogs } = require("../controller/blog/blogController");
const { isAuthenticated } = require("../middleWare/authentication"); 

const { multer, storage } = require("../middleWare/multerController");
const upload = multer({ storage: storage });

router.route("/").get(isAuthenticated,allBlogs);
router.route("/create").get(renderCreateBlog).post(isAuthenticated,upload.single("image"), createBlog);
router.route("/note/:id").get(isAuthenticated,readMore);
router.route("/delete/:id").get(isAuthenticated,deleteBlog)
router.route("/edit/:id").post(isAuthenticated, upload.single("image"),editBlog);
router.route("/edit/:id").get(isAuthenticated,renderEditBlog)
router.route("/myBlogs").get(isAuthenticated,renderMyBlogs)

module.exports = router;