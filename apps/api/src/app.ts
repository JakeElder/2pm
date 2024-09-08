import Koa from "koa";
import Router from "@koa/router";
import path from "path";
import { RegisterRoutes } from "./routes/routes";
import ejs from "ejs";

const app = new Koa();
const router = new Router();

// Spec
router.get("/openai.json", async (ctx) => {
  ctx.type = "application/json";
  ctx.body = require(path.join(__dirname, "../dist/openai.json"));
});

// Docs
router.get("/docs(/?)(.*)", async (ctx) => {
  const body = await ejs.renderFile(
    path.join(__dirname, "views/docs.html.ejs"),
    {
      apiDescriptionUrl: "/openai.json",
      basePath: "/docs",
      hideSchemas: true,
    },
  );
  ctx.type = "html";
  ctx.body = body;
});

// Routes
RegisterRoutes(router);

app.use(router.routes());
app.use(router.allowedMethods());

export default app;
