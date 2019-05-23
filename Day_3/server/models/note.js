const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const noteSchema = new Schema ({
   title: String,
   text: {type: String, require: true},
   color: String,
   createdAt: Date,
});

module.exports = mongoose.model('Note', noteSchema);