
const { Strategy, ExtractJwt } = require('passport-jwt');
const userModel = require('../model/user');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY;

module.exports = passport => {

    passport.use(
        new Strategy(opts, (jwt_payload, done) => {

            userModel
                .findById(jwt_payload.id)
                .then(user => {
                    if(!user) {
                        return done(null, false)
                    }
                    done(null, user);
                })
                .catch(err => console.log(err.message));

        })
    )
}
