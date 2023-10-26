import * as elements from "typed-html";
import { BaseHtml } from "../../html";
import { Question, question } from "../../db/schema";
import { db } from "../../db/db";
import { asc, eq } from "drizzle-orm";
import { t } from "elysia";

// Helper function to format the date in dd/mm/yyyy format
const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const seconds = date.getSeconds();
    return `${year}-${month}-${day} ${hour}:${minute}:${seconds}`;
}

const ButtonForm = ({question}:{question:Question}) => <form hx-post="/lalalala/adm" hx-trigger="submit">
<div class="max-w-2xl mx-auto bg-white p-6 rounded shadow-md flex justify-between items-center">
    <span>{question.question}{question.startTime !== null ? <div class="font-bold color-red">ACTIVE ({formatDate(question.startTime)})</div> :''}</span>
    <input type="hidden" name="questionId" value={question.questionId.toString()} />
    <button style="background-color: #3b82f6; color: #ffffff; font-weight: bold; padding: 8px 16px; border-radius: 9999px; cursor: pointer; border: none; outline: none; transition: background-color 300ms ease-in-out;"
onmouseover="this.style.backgroundColor='#2b6cb0';" 
onmouseout="this.style.backgroundColor='#3b82f6';" type="submit" class="bg-blue-500 text-white font-bold py-2 px-4 rounded-full cursor-pointer transition duration-300 ease-in-out hover:bg-blue-700">
        Activate!
    </button>
</div>
</form>

export default (app: any) => app
  .get('/', async ({ cookie, set }:any) => {
    if (cookie.admpwd !== 'hackertalk-quiz') {
        set.status = 401;
        return <div>You are not allowed here, go away!</div>
    }
    const questions = (await db.select().from(question).orderBy(asc(question.questionId)));
    
    return (
      <BaseHtml>
        <body>
          <div>
              <div class="h-40">
              </div>
              <div class="w-full flex justify-center flex-col">
              {questions.map((question: Question) => (
                    <ButtonForm question={question} />
                ))}
              </div>
          </div>
        </body>
      </BaseHtml>
    );
  }).post('/', async ({body, cookie, set}:any) => {
    // Check the admin password from the cookie
    if (cookie.admpwd !== 'hackertalk-quiz') {
        set.status = 401;
        return <div>You are not allowed here, go away!</div>;
    }

    const { questionId } = body;
    // Obtain the current timestamp from the server
    const now = new Date();
    const nowUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()));

    // Update the startTime field with the server's timestamp
    await db.update(question).set({ startTime: nowUtc }).where(eq(question.questionId, questionId));

    const existingQuestion = (await db.select().from(question).where(eq(question.questionId, questionId))).at(0);
    if (existingQuestion) {
        return <ButtonForm question={existingQuestion} />
    } else {
        return <div>Error while updating 😱</div>;
    }
  },
  {
    body: t.Object({
      questionId: t.String(),
    }),
  });
