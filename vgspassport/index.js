require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const passportFun = require('./lib/passportFun');
const User = require('./schema/userSchema');
const LocalStrategy = require('passport-local');
const cors = require('cors');
const path = require('path');

const routerBasics = require("./routes/routerBasics");

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));
app.use(session(
  {
    secret: 'boxbox',
    resave: false,
    saveUninitialized: false,
  }
));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use('masterplan', new LocalStrategy(
  {
    usernameField: "username",
    passwordField: "password",
  }, passportFun.localStrategy)
);

app.use("/", routerBasics);

module.exports = app;