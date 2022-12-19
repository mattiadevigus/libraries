require('dotenv').config()
const mongoose = require('mongoose');
const crypto = require('crypto');
const User = require('../schema/userSchema');

mongoose.set('strictQuery', false);
mongoose.connect(process.env.CONNECTIONSTRING);

// Crypto
const algorithm = "aes-256-cbc";
const secretKey = "vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3";
const iv = crypto.randomBytes(16);

exports.localStrategy = (username, password, done) => {
    User.findOne({ username: username })
        .then(user => {
            if (!user) {
                return done(null, false, { message: "User does not exist" });
            }
            if (!this.validatePassword(user, password)) {
                return done(null, false, { message: "Password is not valid." });
            }
            console.log("done");
            return done(null, user);
        });
}

// Insert username and password(crypted) into DB
exports.createUser = ((username, password) => {
    const hash = this.generateCrypted(password);
    const user = new User({ username: username, pass: hash });

    user.save(err => {
        if (err) console.log(err);
    });
});

// Find user by username
exports.findUser = (username => {
    return User.find((user) => user.username === username);
});

// Validate password
exports.validatePassword = (user, password) => {
    return this.compareCrypted(password, user.pass);
}

// Return crypted password
exports.generateCrypted = (password) => {
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(password), cipher.final()]);
    return iv.toString("hex") + ":" + encrypted.toString("hex");
}

// Compare password with hash
exports.compareCrypted = (inputPass, hash) => {
    const parts = hash.split(":");
    let iv = Buffer.from(parts.shift(), "hex");
    const encrypted = Buffer.from(parts.join(":"), "hex");

    const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);

    const decrpyted = Buffer.concat([
        decipher.update(encrypted),
        decipher.final(),
    ]);
    hash = decrpyted.toString();

    if (inputPass === hash) {
        return true;
    } else {
        return false;
    }
}

exports.isAdmin = (req, res) => {
    console.log(req.user);
    if(req.user) {
        res.send({allowed: true});
    } else {
        res.send({allowed: false});
    }
}