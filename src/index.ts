import { html } from "@elysiajs/html";
import { Elysia } from "elysia";
import { autoroutes } from "elysia-autoroutes";
import { staticPlugin } from '@elysiajs/static'
import { cookie } from '@elysiajs/cookie'
import { jwt } from '@elysiajs/jwt'

const app = new Elysia()
  .use(cookie())
  .use(autoroutes({ routesDir: './routes' }))
  .use(staticPlugin())
  .use(html())
  .listen(3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;