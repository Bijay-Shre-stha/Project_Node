const express = require('express')
const { blogs } = require('./modal/index.js')
const app = express()



// database connection 
require("./modal/index.js")

// telling the nodejs to set view-engine to ejs
app.set('view engine','ejs')


app.use(express.json())
app.use(express.urlencoded({extended:true}))

// allBlog
app.get("/",(req,res)=>{
    res.render('index')
})

//createBlog
app.get("/create",(req,res)=>{
    res.render("create")
})

//createBlog Post
app.post("/create",async (req,res)=>{

    const title = req.body.title
    const description  = req.body.description
    const subTitle = req.body.subtitle
   
    await blogs.create({
        title : title,
        subTitle:subTitle,
        description : description
    })
    const script = `
    <script>
        alert("Note added");
        window.location.href = "/";
    </script>
    `;

res.send(script);
    
})

app.listen(3000,()=>{
    console.log("NodeJs project has started at port 3000")
})