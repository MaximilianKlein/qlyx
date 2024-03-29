import * as elements from "typed-html";
import { BaseHtml } from "../html";
import { NameForm } from "../components/NameForm";
import { GoToQuiz } from "../components/GoToQuiz";
import { t } from "elysia";
import crypto from "crypto";
import { getUserName } from "../user";
import { locationConfig } from "../config";
import { addUser } from "../db/dbClient";

const generateSecret = (length = 10) => {
  return crypto.randomBytes(length).toString("hex").substring(0, length);
};

export default (app: any) =>
  app
    .get("/", ({ cookie }: any) => {
      return (
        <BaseHtml>
          <body>
            <section class="h-screen p-7">
              <div class="h-full">
                <div class="g-4 flex h-full flex-wrap items-center justify-center lg:justify-evenly">
                  <div class="shrink-1 mb-12 grow-0 basis-auto md:mb-0 md:w-9/12 md:shrink-0 lg:w-6/12 xl:w-6/12">
                    <img
                      src="/public/logo.png"
                      class="w-full rounded border"
                      alt="Sample image"
                    />
                  </div>
                  <div class="mb-12 md:mb-0 md:w-8/12 lg:w-5/12 xl:w-5/12">
                    {cookie.userId ? (
                      <GoToQuiz userName={getUserName(cookie.userId)} />
                    ) : (
                      <NameForm />
                    )}
                  </div>
                </div>
              </div>
            </section>
          </body>
        </BaseHtml>
      );
    })
    .post(
      "/",
      async ({ body, set }: any) => {
        const secret = generateSecret(5);
        const userId = `${body.name}#${body.country}#${secret}`;
        await addUser(userId);
        set.headers["Set-Cookie"] = `userId=${userId}; HttpOnly; Max-Age=${
          7 * 86400
        }`;
        // didn't work somehow.. who cares
        // setCookie('name', body.name, { httpOnly: true, maxAge: 7 * 86400 });
        return <GoToQuiz userName={body.name} />;
      },
      {
        beforeHandle({
          set,
          request: {
            body: { name },
          },
        }: any) {
          if (name === "") {
            set.status = 400;

            throw new Error("Bad Request! Name cannot be empty - duh");
          }
        },
        body: t.Object({
          name: t.String(),
          ...(locationConfig().length !== 0
           ? { location: t.String() } : {} ),
        }),
      }
    );
