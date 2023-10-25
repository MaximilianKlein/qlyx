import * as elements from "typed-html";
import { BaseHtml } from "../html";
import { Header } from "../components/Header";
import { NameForm } from "../components/NameForm";
import { GoToQuiz } from "../components/GoToQuiz";
import { t } from "elysia";
import crypto from 'crypto';
import { db } from "../db/db";
import { user } from "../db/schema";

const generateSecret = (length = 10) => {
  return crypto.randomBytes(length).toString('hex').substring(0, length);
}

export default (app: any) => app
  .get('/', ({ cookie, setCookie }:any) => {
    return (
      <BaseHtml>
        <body>
          <div>
              <div class="h-40">
              </div>
              <div class="w-full flex justify-center">
                { cookie.name
                  ? <GoToQuiz userName={cookie.name} />
                  : <NameForm />
                }
              </div>
          </div>
        </body>
      </BaseHtml>
    );
  })
  .post('/', async ({body, setCookie, set}:any) => {
    const secret = generateSecret(5);
    const userId = `${body.name}#${secret}`;
    await db.insert(user).values({userId});
    set.headers['Set-Cookie'] = `name=${userId}; HttpOnly; Max-Age=${7 * 86400}`;
    // didn't work somehow.. who cares
    // setCookie('name', body.name, { httpOnly: true, maxAge: 7 * 86400 });
    return <GoToQuiz userName={body.name} />
  },
  {
    beforeHandle({ set, request: { body: {name}  } }:any) {
      console.log(set.headers);
      if(name === "") {
          set.status = 400

          throw new Error("Bad Request! Name cannot be empty - duh");
      }
    },
    body: t.Object({
      name: t.String(),
    }),
  });
