require('dotenv').config();
const path = require("path");
const express = require("express");
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");

const Blog = require("./models/blog")

const app = express();
const PORT = 8000;


app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")))

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});


mongoose.connect("mongodb://localhost:27017/InkSpire")
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));


app.get("/", async (req, res) => {
    const allBlogs = await Blog.find({});
    res.render("home",{
        user:req.user,
        blogs:allBlogs,
    }); 
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));
