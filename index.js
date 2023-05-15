const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const userRoute = require('./routes/user')
const blogRoute = require('./routes/blog')
const Blog = require('./models/blog')
const cookieParser = require('cookie-parser')
const { checkForAuthenticationCookie } = require('./middlewares/autherntication')
const app = express();
const PORT = 100;

app.use(cookieParser())
app.set('view engine', 'ejs');
app.use(express.static(path.resolve('./public')))
app.set('views', path.resolve('./views'));
app.use(express.urlencoded({ extended: false }));
mongoose.connect("mongodb://localhost:27017/blogify").then(e => console.log("DB Connected"))
app.use(checkForAuthenticationCookie('token'));

app.get('/', async (req, res) => {
    const allBlogs = await Blog.find({})
    res.render('home', {
        user: req.user,
        blogs: allBlogs
    });
})
app.use('/user/', userRoute);
app.use('/blog', blogRoute);
app.listen(PORT, () => {
    console.log("Server is running on ....", PORT);
})