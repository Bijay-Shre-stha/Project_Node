const { blogs, users } = require("../../modal")
const fs = require("fs")

const db = require("../../modal/index")
const sequelize = db.sequelize
exports.renderCreateBlog = (req, res) => {
    res.render("create")
}

exports.createBlog = async (req, res) => {
    const title = req.body.title
    const description = req.body.description
    const subTitle = req.body.subtitle
    const userId = req.user[0].id

    const fileName = req.file.filename

    if (!title || !description || !subTitle || !fileName) {
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
        image: process.env.URL + fileName
    })
    req.flash("success", "Noted added")
    res.redirect("/")
}

exports.allBlogs = async (req, res) => {
    const success = req.flash("success")

    
    // const allBlogs = sequelize.query("SELECT * FROM BLOGS", {
    //     type: sequelize.QueryTypes.SELECT
    // })

    const allBlogs = await blogs.findAll({
        include: {
            model: users
        }

    })

    res.render('index', {
        blogs: allBlogs, success
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
    const oldData = await blogs.findAll({
        where: {
            id: id
        }
    })
    const oldImagePath = oldData[0].image
    const fileNameInUploads = oldImagePath.slice(22)
    console.log(fileNameInUploads)
    await blogs.destroy({
        where: {
            id: id

        }
    });
    fs.unlink('uploads/' + fileNameInUploads, (err) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("deleted from folder and Database");
        }
    }
    )
    req.flash("success", "Note Deleted")
    res.redirect("/")
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

    const oldData = await blogs.findAll({
        where: {
            id: id
        }
    })

    let fileUrl;
    if (req.file) {
        fileUrl = process.env.URL + req.file.filename
    } else {
        fileUrl = oldData[0].image
    }

    await blogs.update({
        title: title,
        subTitle: subTitle,
        description: description,
        image: fileUrl
    }, {
        where: {
            id: id,
        }
    })
    // http://localhost:3000/1696256867982-Background1.png
    const oldImagePath = oldData[0].image
    const fileNameInUploads = oldImagePath.slice(22)
    console.log(fileNameInUploads)

    fs.unlink('uploads/' + fileNameInUploads, (err) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("deleted from database");
        }
    })

    // fs.unlink('uploads/test.ts',(err)=>{
    //     if(err){
    //         console.log(err);
    //     }
    //     else{
    //         console.log("deleted");
    //     }
    // })
    req.flash("success", "Note Updated")
    res.redirect("/")
}

exports.renderMyBlogs = async (req, res) => {
    // get this users blogs 
    const userId = req.userId;
    // find blogs of this userId 
    const myBlogs = await blogs.findAll({
        where: {
            userId: userId
        }
    })

    res.render("myBlogs.ejs", { myBlogs: myBlogs })
}