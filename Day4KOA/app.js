const Koa = require("koa");
const app = new Koa();
const mongoose = require("mongoose");
const koaBody = require("koa-body");
const router = require("./router/router.js");

// app.use(async(ctx) => ctx.body = "Hello from KOA!!!");//это прописываем для проверки подключения сервера, пока не прописаны роуты. После того, как прописали роуты - эта строчка уже не нужна

mongoose.Promise = global.Promise;
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.connect("mongodb://bc7:123qwe@ds241489.mlab.com:41489/test_base");

app.use(koaBody());
app
 .use(router.routes())
 .use(router.allowedMethods());


app.listen(3010, () => console.log("server is running good!!"));

