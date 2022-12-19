const mongoose = require('mongoose');
const { Schema } = mongoose;

//user schema 
const userSchema = new Schema({
    username: { type: String, unique: true },
    pass: String,
})

const User = mongoose.model('User', userSchema);

module.exports = User;
