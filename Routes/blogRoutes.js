const router = require("express").Router();
const { renderCreateBlog, createBlog, allBlogs, readMore, deleteBlog, renderEditBlog, editBlog, renderMyBlogs } = require("../controller/blog/blogController");
const { isAuthenticated } = require("../middleWare/authentication"); 

router.route("/").get(allBlogs);
router.route("/create").get(renderCreateBlog).post(isAuthenticated, createBlog);
router.route("/note/:id").get(readMore);
router.route("/delete/:id").get(isAuthenticated,deleteBlog)
router.route("/editBlog/:id").post(isAuthenticated,editBlog)
router.route("/edit/:id").get(isAuthenticated,renderEditBlog)
router.route("/myBlogs").get(isAuthenticated,renderMyBlogs)

module.exports = router;