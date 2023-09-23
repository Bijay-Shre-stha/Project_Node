const { blogs } = require("../../modal")

exports.renderCreateBlog = (req, res) => {
    res.render("create")
}

exports.createBlog = async (req, res) => {
    const title = req.body.title
    const description = req.body.description
    const subTitle = req.body.subtitle
    await blogs.create({
        title: title,
        subTitle: subTitle,
        description: description
    })
    const script = `
    <script>
        alert("Note added");
        window.location.href = "/";
    </script>
    `;
    res.send(script);
}

exports.allBlogs = async (req, res) => {
    const allBlogs = await blogs.findAll()

    res.render('index', {
        blogs: allBlogs
    })
}

exports.readMore = async (req, res) => {
    const { id } = req.params
    const blog = await blogs.findAll({
        where: {
            id: id
        }
    })
    res.render("readMore.ejs", {
        blog: blog
    })
}

exports.deleteBlog = async (req, res) => {
    const id = req.params.id
    await blogs.destroy({
        where: {
            id: id
        }
    });
    const script = `
    <script>
        alert("Note deleted");
        window.location.href = "/";
    </script>
    `;
    res.send(script);
}

exports.renderEditBlog =async (req, res) => {
    const id = req.params.id
    const blog = await blogs.findAll({
        where: {
            id: id
        }
    })
    res.render("edit", { blog: blog });
}

exports.editBlog =async (req, res) => {
    const id = req.params.id
    const title = req.body.title
    const description = req.body.description
    const subTitle = req.body.subtitle
    await blogs.update({
        title: title,
        subTitle: subTitle,
        description: description
    }, {
        where: {
            id: id
        }
    })
    const script = `
    <script>
        alert("Note updated");
        window.location.href = "/";
    </script>
    `;
    res.send(script);
}