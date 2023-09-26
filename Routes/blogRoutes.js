const router = require("express").Router();
const { renderCreateBlog, createBlog, allBlogs, readMore, deleteBlog, renderEditBlog, editBlog } = require("../controller/blog/blogController");
const { isAuthenticated } = require("../middleWare/authentication"); 

router.route("/").get(allBlogs);
router.route("/create").get(renderCreateBlog).post(isAuthenticated, createBlog);
router.route("/note/:id").get(readMore);
router.route("/delete/:id").get(deleteBlog);
router.route("/edit/:id").get(renderEditBlog).post(editBlog);

module.exports = router;