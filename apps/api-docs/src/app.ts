import Koa from "koa";
import Router from "@koa/router";
import path from "path";
import ejs from "ejs";

const app = new Koa();
const router = new Router();

router.get("/(.*)", async (ctx) => {
  const req = await fetch("http://localhost:3003/openapi.json");
  const apiDescriptionDocument = await req.text();

  const body = await ejs.renderFile(
    path.join(__dirname, "views/docs.html.ejs"),
    { apiDescriptionDocument },
  );

  ctx.body = body;
});

app.use(router.routes());
app.use(router.allowedMethods());

export default app;
