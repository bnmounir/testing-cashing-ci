const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');

const User = mongoose.model('User');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (e) {
        console.log(e);
    }
});

passport.use(
    new GoogleStrategy(
        {
            callbackURL: '/auth/google/callback',
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            proxy: true
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const existingUser = await User.findOne({
                    googleId: profile.id
                });
                if (existingUser) {
                    return done(null, existingUser);
                }
                const user = await new User({
                    googleId: profile.id,
                    displayName: profile.displayName
                }).save();
                done(null, user);
            } catch (err) {
                done(err, null);
            }
        }
    )
);
