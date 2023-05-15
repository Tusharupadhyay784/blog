const { Router } = require('express');
const User = require('../models/user');

const router = Router();



router.get('/signin', (req, res) => {
    return res.render('signin');
})
router.get('/signup', (req, res) => {
    return res.render('signup');
})
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await User.matchPasswordAndGenerateToken(email, password);
        console.log("token", token);
        return res.cookie('token', token).redirect('/');
    }
    catch (e) {
        // console.log(e.message);
        res.render('signin', {
            error: "Incorrect Email or Password"
        })
    }

})
router.post('/signup', async (req, res) => {
    const { fullName, email, password } = req.body;
    await User.create({
        fullName,
        email,
        password
    })
    return res.redirect('/');
    // const { fullName, email, password, role } = req.body;
    // const salt = randomBytes(16).toString('hex');
    // const hashedPassword = createHmac('sha256', salt).update(password).digest('hex');
    // const user = new User({
    //     fullName,
    //     email,
    //     salt,
    //     password: hashedPassword,
    //     role
    // });
    // user.save()
    //     .then(() => {
    //         return res.redirect('/signin');
    //     })
})
router.get('/logout', (req, res) => {
    res.clearCookie('token').redirect('/');
})
module.exports = router;
