const passport = require('passport')
const googleStrategy = require('passport-google-oauth20')
const keys = require('./keys')

//clientID: 694064478458-c0n5152oi73nb9cd9erlemqrdour867o.apps.googleusercontent.com
//client secret: f5-jq-TOv_OLnnqFu9DURoiF

passport.use(
    new googleStrategy({
        callbackURL: '/auth/google/redirect',
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret

    }, (accessToken, refreshToken, profile, done) => {
        // passport callback
        console.log('passport callback fired')
        console.log(profile)
    })
)


