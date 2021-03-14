const router = require('express').Router();
const passport = require('passport')

router.get('/login', (req, res) => {
    res.render('login')
})

//clientID: 694064478458-c0n5152oi73nb9cd9erlemqrdour867o.apps.googleusercontent.com
//client secret: f5-jq-TOv_OLnnqFu9DURoiF

//auth with GOOGLE
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

//callback route for google redirect
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    res.send('callback URI')
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