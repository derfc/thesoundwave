const router = require('express').Router();
const passport = require('passport')
const bodyParser = require("body-parser");

router.use(bodyParser.urlencoded({ extended: true, }));
router.use(bodyParser.json());

//register route
router.get("/register", (req, res) => {
    res.render("register");
});

//register logic
router.post("/register", passport.authenticate('local-signup', {
    successRedirect: '/auth/login',
    failureRedirect: '/auth/register'
}));




// (req, res) => {

//     console.log(req.body)
//     let username = req.body.username
//     let password = req.body.password

//     // insert register data in knex
//     // fireoff passport

// });


router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', passport.authenticate('local-login', { failureRedirect: '/auth/login' }),
    function (req, res) {
        res.redirect('/home')
    });

//logout
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect('/')
})

//auth with GOOGLE
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

//callback route for google redirect
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    console.log('this is the user', req.user);
    res.redirect('/home')
})

//auth with FACEBOOK
router.get('/facebook', passport.authenticate('facebook', {
    scope: ['email', 'user_location']
}));

//callback route for facebook redirect
router.get('/facebook/redirect', passport.authenticate('facebook'), (req, res) => {
    console.log('this is the user', req.user);
    res.redirect('/home')
})

module.exports = router;