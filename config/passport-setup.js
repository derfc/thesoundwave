const passport = require('passport')
const googleStrategy = require('passport-google-oauth')

passport.use(new googleStrategy({

}), () => {
    // passport callback
})