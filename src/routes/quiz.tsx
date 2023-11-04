import * as elements from "typed-html";
import { BaseHtml } from "../html";
import { Logout } from "../components/Logout";
import { getUserName } from "../user";

export default (app: any) =>
  app.get("/", ({ cookie }: any) => {
    return (
      <BaseHtml>
        <body>
          <div>
            <div class="w-full flex justify-between pr-8 pt-8 pl-8">
              <span><b>{getUserName(cookie.userId)}</b></span>
              <Logout />
            </div>
            <div class="h-40"></div>
            <div class="w-full flex justify-center" hx-get="/quiz-content" hx-trigger="load" />
          </div>
        </body>
      </BaseHtml>
    );
  });
