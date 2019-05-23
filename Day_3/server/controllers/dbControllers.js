const mongoose = require('mongoose');

const Note = require('../models/note.js');

module.exports.setUpConnection = function(){
   mongoose.connect("mongodb://bc7:123qwe@ds241489.mlab.com:41489/test_base");
};

module.exports.createNote = function (data){
   const note = new Note({
   title: data.title,
   text: data.text,
   color: data.color,
   createdAt: new Date(),
   });
   return note.save();
};

module.exports.noteList = function (){
   return Note.find();
};

module.exports.delNote = function (id){
   return Note.findById().remove();
};