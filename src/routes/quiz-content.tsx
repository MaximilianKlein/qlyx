import * as elements from "typed-html";
import { Quiz } from "../components/Quiz";
import { Timer } from "../components/Timer";
import { t } from "elysia";
import {
  ActiveQuestion,
  addAnswer,
  getActiveQuestion,
  getCurrentQuestion,
  getUserAnswer,
  updateAnswer,
} from "../db/dbClient";
import { Cache } from "../cache";
import { Question } from "../db/schema";

const questionCache = new Cache<ActiveQuestion | undefined>();
const ttl = 1;

const Trigger = ({questionIndex, active}:{questionIndex:number, active: boolean}) => {
  return (
    <div
      class="hidden"
      hx-get={`/quiz-content?client-question=${questionIndex}&active=${active}`}
      hx-trigger="every 1s"
      hx-swap="outerHTML"
    >
      CLICK
    </div>
  );
}

const isActive = (activeQuestion:Question):boolean => {
  if (!activeQuestion.startTime) {
    return false;
  }
  const endTime = new Date(
    activeQuestion.startTime.getTime() + activeQuestion.duration * 1000
  );
  const now = new Date();
  return now >= activeQuestion.startTime && now <= endTime;
}

// TODO Reload => select selected answer
export default (app: any) =>
  app
    .get("/", async ({ cookie, set, query }: any) => {
      try {
        const userId = cookie.userId; // Adjust this if the userId is stored differently in the cookie
        const clientQuestion = query["client-question"];
        const clientActive = query["active"];

        const cachedValue = await questionCache.getCacheValue('question', ttl);
        // if the question and the active state didn't change, return cached result if set
        if (cachedValue && cachedValue.question.questionId == clientQuestion && !!clientActive === isActive(cachedValue.question)) {
          return <Trigger questionIndex={clientQuestion} active={clientActive} />
        }
        const result = await questionCache.promiseCache('question', () => getActiveQuestion(userId), ttl);

        const activeQuestion = result?.question;
        const activeAnswer = result?.answer;

        if (!activeQuestion || !activeQuestion.startTime) {
          return (
            <div
              hx-get="/quiz-content"
              hx-trigger="every 1s"
              hx-swap="outerHTML"
            >
              Please wait until the game starts!
            </div>
          );
        }

        const questionIndex = activeQuestion.questionId;
        const endTime = new Date(
          activeQuestion.startTime.getTime() + activeQuestion.duration * 1000
        );
        const now = new Date();
        const active = now >= activeQuestion.startTime && now <= endTime;

        const remainingTimer = Math.round(
          (endTime.getTime() - now.getTime()) / 1000
        );

        const content = cookie.userId ? (
          clientQuestion == questionIndex && active ? (
            <Timer remainingTimer={remainingTimer} />
          ) : (
            <Quiz
              question={activeQuestion}
              active={active}
              questionIndex={questionIndex}
              remainingTimer={remainingTimer}
              selectedAnswer={activeAnswer?.answer}
              oob={clientQuestion !== undefined}
            />
          )
        ) : (
          <div>
            You are not logged in, please go <a href="/">here</a>
          </div>
        );

        return (
          <Trigger questionIndex={questionIndex} active={active} /> +
          "\n" +
          content.replace(" hx-swap-oob ", ` hx-swap-oob="true" `)
        );
      } catch (e) {
        console.error(e);
        set.status = 500;
      }
    })
    .post(
      "/",
      async ({ body, cookie }: any) => {
        const { answer: selectedAnswer, questionIndex } = body;

        // Extract userId from the cookie
        const userId = cookie.userId; // Adjust this if the userId is stored differently in the cookie

        // Retrieve the question from the database
        const currentQuestion = await getCurrentQuestion(questionIndex);

        if (!currentQuestion || !currentQuestion.startTime) {
          return <div>Something went wrong 😵"</div>;
        }
        // Calculate the end time for the question
        const endTime = new Date(
          currentQuestion.startTime.getTime() + currentQuestion.duration * 1000
        );
        const now = new Date();

        // Check if the current time is after the end time
        if (now > endTime) {
          // If the response is late, discard it and return a message
          return "Response is too late and has been discarded!";
        }
        const secondsSinceStart = Math.round(
          (now.getTime() - currentQuestion.startTime.getTime()) / 1000
        );

        // Check if an answer already exists for the user and the question
        const existingAnswer = await getUserAnswer(questionIndex, userId);

        if (existingAnswer) {
          // If an answer exists, update it
          await updateAnswer(questionIndex, userId, {
            selectedAnswer,
            time: secondsSinceStart,
            correct: selectedAnswer == currentQuestion.correctAnswer - 1,
          });
        } else {
          // If no answer exists, insert a new one
          await addAnswer(questionIndex, userId, {
            selectedAnswer,
            time: secondsSinceStart,
            correct: selectedAnswer == currentQuestion.correctAnswer - 1,
          });
        }

        // Return a confirmation message
        return "Answer saved!";
      },
      {
        body: t.Object({
          answer: t.String(),
          questionIndex: t.String(),
        }),
      }
    );
