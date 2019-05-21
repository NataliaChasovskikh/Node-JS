const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const mongoose = require ('mongoose');
const User = require('./shema');
const PORT = process.env.PORT || 3002;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

mongoose.Promise = global.Promise;
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://bc7:123qwe@ds241489.mlab.com:41489/test_base');

app.get('/', (req, res) => res.send('hellow this is my site'));
app.get('/user/', (req, res) => 
    User.find({}, (err, users) =>{
        if (err) throw err;   
        res.send(users);
    })
);
app.get('/user_name/:name', (req, res) => 
    User.find({name: req.params.name}, (err, user) =>{
        if (err) throw err;   
        res.send(user);
    })
);
app.delete('/user_del/:_id', (req, res) => {
User.findByIdAndRemove(req.params._id, (err) =>{
    if (err) throw err;
  
    // we have deleted the user
    res.json(200, 'User deleted!');   
  })
});
app.put('/user_put/:_id', (req, res) => {
    User.findByIdAndUpdate(req.params._id, { username: req.body.username }, 
    (err,user) =>{
        if (err) throw err;
      
        // we have deleted the user
        res.json(200, 'User update!');
      })
});
app.get('/user_id/:id', (req, res) => 
    User.findById(req.params.id, (err, user) =>{
        if (err) throw err;   
        res.send(user);
    })
);
app.get('/user_id/', (req, res) => 
    User.find({_id: ObjectId("req.body.id")}, (err, user) =>{
        if (err) throw err;   
        res.send(user);
    })
);
app.post('/user/', (req, res) => {
    let newUser = User({
            name: req.body.name,
            username: req.body.username,
            password: req.body.password,
            admin: true
          });

    newUser.save(function(err) {
    if (err) throw err;  
    res.send(newUser);   
    });   
});  

app.get()
    
app.listen(PORT, ()=> console.log(`Сервер запущен на порту ${PORT}`));