const { blogs, users } = require("../../modal")

exports.renderCreateBlog = (req, res) => {
    res.render("create")
}

exports.createBlog = async (req, res) => {
    const title = req.body.title
    const description = req.body.description
    const subTitle = req.body.subtitle
    const userId = req.user[0].id

    const fileName = req.file.filename

    if(!title ||!description ||!subTitle ||!fileName ){
        const script = `
        <script>
            alert("Please fill all the fields");
            window.location.href = "/create";
        </script>
        `;
        return res.send(script);
    }
    

    await blogs.create({
        title: title,
        subTitle: subTitle,
        description: description,
        userId: userId,
        image: process.env.URL+fileName
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
    const allBlogs = await blogs.findAll({
        include: {
            model: users
        }

    })

    res.render('index', {
        blogs: allBlogs
    })
}

exports.readMore = async (req, res) => {
    const { id } = req.params
    const blog = await blogs.findAll({
        where: {
            id: id
        },
        include: {
            model: users
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

exports.renderEditBlog = async (req, res) => {
    const id = req.params.id
    const blog = await blogs.findAll({
        where: {
            id: id
        }
    })
    res.render("edit", { blog: blog });
}

exports.editBlog = async (req, res) => {
    const id = req.params.id
    const title = req.body.title
    const description = req.body.description
    const subTitle = req.body.subtitle
    await blogs.update({
        title: title,
        subTitle: subTitle,
        description: description,
    }, {
        where: {
            id: id,

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

exports.renderMyBlogs = async (req,res)=>{
    // get this users blogs 
    const userId = req.userId;
    // find blogs of this userId 
    const myBlogs = await blogs.findAll({
        where : {
            userId : userId
        }
    })

    res.render("myBlogs.ejs",{myBlogs : myBlogs})
}