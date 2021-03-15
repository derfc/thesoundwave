
require("dotenv").config();
const knex = require('knex')({
    client: 'postgresql',
    connection: {
        database: process.env.db_name,
        user: process.env.db_username,
        password: process.env.db_password,
    }
});

module.exports = {
    findUserById: function (profileId) {
        return knex('users')
            .select()
            .where({ google_id: profileId })
            .first();
    },

    createUser: function (profileId, username, thumbnail) {
        return knex('users')
            .insert({ username: username, google_id: profileId, profile_pic: thumbnail });
    }
};