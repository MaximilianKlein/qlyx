import * as elements from "typed-html";
import { BaseHtml } from "../html";
import { Quiz } from "../components/Quiz";

export default (app: any) =>
  app.get("/", ({ cookie, setCookie }: any) => {
    return (
      <BaseHtml>
        <body>
          <div>
            <div class="h-40"></div>
            <div class="w-full flex justify-center" hx-get="/quiz-content" hx-trigger="load" />
          </div>
        </body>
      </BaseHtml>
    );
  });
