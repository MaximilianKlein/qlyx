import * as elements from "typed-html";
import { Quiz } from "../components/Quiz";
import { Timer } from "../components/Timer";
import { t } from "elysia";
import { db } from "../db/db";
import { answer, question, user } from "../db/schema";
import { and, desc, eq, isNotNull, isNull, or } from "drizzle-orm";

// TODO Reload => select selected answer
export default (app: any) =>
  app
    .get("/", async ({ cookie, set, query }: any) => {
      try {
        const userId = cookie.userId; // Adjust this if the userId is stored differently in the cookie
        const clientQuestion = query["client-question"];
        const result = await db
            .select()
            .from(question)
            .leftJoin(answer, and(
                eq(question.questionId, answer.questionId),
                eq(answer.userId, userId)
            ))
            .where(isNotNull(question.startTime))
            .orderBy(desc(question.startTime))
            .limit(1);

        const activeQuestion = result[0]?.question;
        const activeAnswer = result[0]?.answer;

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

        const trigger = (
          <div
            class="hidden"
            hx-get={`/quiz-content?client-question=${questionIndex}`}
            hx-trigger="every 1s"
            hx-swap="outerHTML"
          >
            CLICK
          </div>
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
          trigger +
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
      async ({ body, cookie, set }: any) => {
        const { answer: selectedAnswer, questionIndex } = body;

        // Extract userId from the cookie
        const userId = cookie.userId; // Adjust this if the userId is stored differently in the cookie

        // Retrieve the question from the database
        const currentQuestion = (
          await db
            .select()
            .from(question)
            .where(eq(question.questionId, questionIndex))
        ).at(0);

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
        const existingAnswer = (
          await db
            .select()
            .from(answer)
            .where(
              and(
                eq(answer.userId, userId),
                eq(answer.questionId, questionIndex)
              )
            )
        ).at(0);

        if (existingAnswer) {
          // If an answer exists, update it
          await db
            .update(answer)
            .set({
              answer: selectedAnswer,
              time: secondsSinceStart,
              correct: selectedAnswer == currentQuestion.correctAnswer - 1,
            })
            .where(
              and(
                eq(answer.userId, userId),
                eq(answer.questionId, questionIndex)
              )
            );
        } else {
          // If no answer exists, insert a new one
          await db.insert(answer).values({
            userId: userId,
            questionId: questionIndex,
            answer: selectedAnswer,
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
