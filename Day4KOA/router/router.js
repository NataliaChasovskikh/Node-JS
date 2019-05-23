const Router = require("koa-router");
const router = new Router();
const database = require("../models/database.js");


router.get("/", async ctx => (ctx.body = "KOA is here!!!"));

router.post("/user", async ctx => {
   try {
      const results = await database.add({...ctx.request.body});
      ctx.body = results;
   }
   catch (err) {
      console.log("err", err);
      ctx.body = "Internal error post"
   }
   
});

router.get("/user", async ctx => {
   try {
      const results = await database.getAll();
      ctx.body = results;
   }
   catch (err) {
      console.log("err", err);
      ctx.status = "500";
      ctx.body = "Internal error getAll"
   }
   
});

router.get("/user/:id", async ctx => {
   try {
      const results = await database.getById(ctx.params.id);
      ctx.body = results;
   }
   catch (err) {
      console.log("err", err);
      ctx.status = "500";
      ctx.body = "Internal error getUser"
   }
   
});

router.put("/user/:id", async ctx => {
   try {
      const results = await database.updateUser(ctx.params.id, {...ctx.request.body});
      const us = {_id:ctx.params.id, ...ctx.request.body};
      ctx.body =  us; 
   }
   catch (err) {
      console.log("err", err);
      ctx.body = "Internal error UPDATE"
   }
   
});

router.del("/user/:id", async ctx => {
   try {
      const results = await database.delUser(ctx.params.id);
      ctx.body = "User DEL";
   }
   catch (err) {
      console.log("err", err);
      ctx.body = "Internal error del"
   }
   
});

module.exports = router;


