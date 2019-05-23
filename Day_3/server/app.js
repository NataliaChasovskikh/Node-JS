const express = require('express'); //создали сервер
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();//вызвали функцию - теперь сервер рабочий
const db = require("./controllers/dbControllers.js");

const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

const PORT = process.env.PORT || 3001;

db.setUpConnection();//подключаем базу данных

app.use(bodyParser.json());//midlleweare-сначала через этот проходит
app.use(cors({origin:"*"}));//midlleweare-потом через этот и потом в app(get);

app.get("/notes", (req, res) => db.noteList().then(data => res.send(data)));
app.post("/notes", (req, res) => db.createNote(req.body).then(data => res.send(data)));
app.delete("/notes/:id", (req,res) => db.delNote(req.params.id).then(data => res.sendStatus(200)));

app.listen(PORT, () =>{
   console.log(`server is runing on ${PORT}`);
});//сервер слушает на этом порту



