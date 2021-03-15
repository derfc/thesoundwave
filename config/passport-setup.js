const { default: knex } = require('knex')
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

    }, async (accessToken, refreshToken, profile, done) => {
        // passport callback
        console.log('passport callback fired')
        console.log(profile)
        const newuser = { username: profile.displayName, googleID: profile.id }

        // insert database

        const user = await knex('users').where('google_id', user.googleID)
        console.log(user)


        knex('users').insert({ username: newuser.username, google_id: newuser.googleID })
            .then(() => {
                console.log('user inserted')
            })



    })
)


