
const { Strategy, ExtractJwt } = require('passport-jwt');
const FacebooktokenStrategy = require('passport-facebook-token');
const GooglePlustokenStrategy= require('passport-google-plus-token');

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
    ),
    passport.use('googleToken', new GooglePlustokenStrategy({

        clientID: "247140277869-r2or5omfjbu98qm4bfa53m4c4qu8u7ge.apps.googleusercontent.com",
        clientSecret: "X9gBpm5WnPWEXk5WDvEo5Fy2"
    }, async (accessToken, refreshToken, profile, cb) => {

        try {
            const existingUser = await userModel.findOne({"google.id":profile.id});
            if(existingUser) {
                return cb(null, existingUser)
            }
            const newUser = new userModel({
                method: 'google',
                google: {
                    id: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    avatar: profile.photos[0].value
                }
            })
            await newUser.save();
            cb(null, newUser);
        } catch(error) {
            cb(error, false, error.message);
        }

    }));

    passport.use('facebookToken', new FacebooktokenStrategy({

        clientID: "840845056395272",
        clientSecret: "5219457a0f6e9787f351ef2a37fd67fa"
    }, async (accessToken, refreshToken, profile, cb) => {

        try {
            const existingUser = await userModel.findOne({"facebook.id" : profile.id});
            if(existingUser) {
                return cb(null, existingUser)
            }
                const newUser =new userModel({
                    method: 'facebook',
                    facebook: {
                        id: profile.id,
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        avatar: profile.photos[0].value
                    }
                });
                await newUser.save();
                cb(null, newUser);
        } catch (error){
            cb(error, false, error.message)
        }
    }))
}
