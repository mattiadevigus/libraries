const passport = require('passport');
const LocalStrategy = require('passport-local');
const passportFun = require('./passportFun');

passport.use(new LocalStrategy(
    {
        usernameField: "username",
        passwordField: "password",
        passReqToCallback: true
    }, passportFun.localStrategy)
);

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

module.exports = passport;