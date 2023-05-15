const { Router } = require('express')
const router = Router();
const multer = require('multer');
const path = require('path');
const Blog = require('../models/blog');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(`./public/uploads/`))
    },
    filename: function (req, file, cb) {
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        // cb(null, file.fieldname + '-' + uniqueSuffix)
        const filename = `${Date.now()}-${file.originalname}`
        cb(null, filename);

    }
})

const upload = multer({ storage: storage })





router.get('/add-new', (req, res) => {
    return res.render('addBlog', {
        user: req.user,

    })
})
router.post('/', upload.single('coverImage'), async (req, res) => {
    console.log(req.body);
    console.log(req.file);
    const { title, body } = req.body
    const blog = await Blog.create({
        body, title, createdBy: req.user._id,
        coverImageURL: `/uploads/${req.file.filename}`
    })
    return res.redirect(`/blog/${blog._id}`);
})



module.exports = router;