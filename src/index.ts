import { html } from "@elysiajs/html";
import { Elysia } from "elysia";
import { autoroutes } from "elysia-autoroutes";
import { staticPlugin } from '@elysiajs/static'
import { cookie } from '@elysiajs/cookie'
import { jwt } from '@elysiajs/jwt'

const app = new Elysia()
  .use(cookie())
//   .use(
//         jwt({
//             name: 'jwt',
//             secret: '--1-1--1-1'
//         })
//     )
//   .get('/sign/:name', async ({ jwt, cookie, setCookie, params }) => {
//       setCookie('auth', await jwt.sign(params), {
//           httpOnly: true,
//           maxAge: 7 * 86400,
//       })

//       return `Sign in as ${cookie.auth}`
//   })
//   .get('/profile', async ({ jwt, set, cookie: { auth } }) => {
//       const profile = await jwt.verify(auth)

//       if (!profile) {
//           set.status = 401
//           return 'Unauthorized'
//       }

//       return `Hello ${profile.name}`
//   })
  .use(autoroutes({ routesDir: './routes' }))
  .use(staticPlugin())
  .use(html())
  .listen(3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;