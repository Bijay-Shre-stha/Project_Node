const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true })); // Add this middleware to parse POST request bodies

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/create", (req, res) => {
    res.render("create");
});

app.post("/create", (req, res) => {
    const { title, subtitle, description } = req.body;

    if (!title || !subtitle || !description) {
        res.status(400).json({ error: "All fields are required." });
        return;
    }

    const jsonData = {
        title,
        subtitle,
        description
    };
    console.log(jsonData);

});

app.listen(3000, () => {
    console.log("started at 3000");
});
