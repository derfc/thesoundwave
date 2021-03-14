const router = require('express').Router();

router.get('/login', (req, res) => {
    res.render('login')
})

//auth with GOOGLE
router.get('/google', (req, res) => {
    //handle with passport
    res.send('logging in with google')
})

//auth with FACEBOOK
router.get('/facebook', (req, res) => {
    //handle with passport
    res.send('logging in with facebook')
})



//auth logout
router.get('/logout', (req, res) => {
    res.send('logging out')
})

module.exports = router;