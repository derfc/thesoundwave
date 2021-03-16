require("dotenv").config();
const knex = require('knex')({
    client: 'postgresql',
    connection: {
        database: process.env.db_name,
        user: process.env.db_username,
        password: process.env.db_password,
    }
});
const database = require('../database/userdata')
const passport = require('passport')
const googleStrategy = require('passport-google-oauth20').Strategy
const facebookStrategy = require('passport-facebook').Strategy
const keys = require('./keys')

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((id, done) => {
    // User.findById(id, function (err, user) {
    //     done(err, user);
    // })
    done(null, id)
})

passport.use(
    new googleStrategy({
        callbackURL: '/auth/google/redirect',
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
    }, async (accessToken, refreshToken, profile, done) => {
        // passport callback
        console.log('passport callback fired')
        console.log(profile)

        // insert database
        database.findUserById(profile.id).then(function (id) {
            if (id) {
                return done(null, profile);
            } else {
                database.createUser(profile.id, profile.displayName, profile._json.picture)
                    .then(function (id) {
                        return done(null, profile);
                    });
            }
        });
    })
)

passport.use(
    new facebookStrategy({
        clientID: keys.facebook.appID,
        clientSecret: keys.facebook.appSecret,
        callbackURL: "/auth/facebook/redirect",
        profileFields: ['id', 'displayName', 'photos', 'email']
    }, async (accessToken, refreshToken, profile, done) => {
        console.log('passport callback fired')
        console.log(profile)

        database.findUserByFacebookID(profile.id).then(function (id) {
            if (id) {
                return done(null, profile);
            } else {
                database.createFBuser(profile.id, profile.displayName, profile._json.picture.data.url)
                    .then(function (id) {
                        return done(null, profile);
                    });
            }
        });



        // // User.findOrCreate({ facebookId: profile.id }, function (err, user) {
        // //     return done(err, user);
        // });
    }
    ));










 // await knex('users').where('google_id', newuser.googleID)
        //     .then((currentUser) => {
        //         if (currentUser[0] !== undefined) {
        //             //already have the user 
        //             console.log('user is', currentUser)
        //             return done(null, currentUser)
        //         } else {
        //             // create user in database  
        //             try {
        //                 knex('users').insert({ username: newuser.username, google_id: newuser.googleID })
        //                     .then(() => {
        //                         knex('users').where('google_id', newuser.googleID)
        //                             .then((newnew) => {
        //                                 console.log('user inserted', newnew);
        //                                 return done(null, newnew)
        //                             })
        //                     })
        //             }
        //             catch {
        //                 console.log('cannot run knex')
        //             }
        //         }
        //     })
// const getUser = async () => {
//     try {
//         await knex('users').insert({ username: 'oscar', google_id: '123' })
//             .then(() => {
//                 console.log('user inserted')
//             })
//     }
//     catch {
//         console.log('cannot run knex')
//     }
// }

// getUser()