const mongoose = require('mongoose');
const { Schema } = mongoose;

//user schema 
const fileSchema = new Schema({
    hash: String,
    name: String,
    link: String,
    path: String,
    page: String,
    date: Date
});

const File = mongoose.model('File', fileSchema);

module.exports = File;
