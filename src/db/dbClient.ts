import { and, desc, eq, isNotNull, sql } from "drizzle-orm";
import { db } from "./db";
import { Answer, Question, answer, question, user } from "./schema";

export const addUser = async (userId: string) => {
  await db.insert(user).values({ userId });
};

export type LeaderboardEntry = {
  userId: string;
  correctAnswers: number;
  answers: number;
};

export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  return await db
    .select({
      userId: user.userId,
      correctAnswers: sql<number>`sum(${answer.correct})`,
      answers: sql<number>`count(${answer.correct})`,
    })
    .from(user)
    .leftJoin(answer, eq(user.userId, answer.userId))
    .groupBy(user.userId)
    .orderBy(desc(sql<number>`sum(${answer.correct})`));
};

export type ActiveQuestion = {
    question: Question,
    answer: Answer | null,
}

export const getActiveQuestion = async (userId: string):Promise<ActiveQuestion | undefined> => {
  return (await db
    .select()
    .from(question)
    .leftJoin(
      answer,
      and(eq(question.questionId, answer.questionId), eq(answer.userId, userId))
    )
    .where(isNotNull(question.startTime))
    .orderBy(desc(question.startTime))
    .limit(1))[0];
};

export const getCurrentQuestion = async (questionIndex: number) => {
  return (
    await db
      .select()
      .from(question)
      .where(eq(question.questionId, questionIndex))
  ).at(0);
};

export const getUserAnswer = async (questionIndex: number, userId: string) => {
  return (
    await db
      .select()
      .from(answer)
      .where(
        and(eq(answer.userId, userId), eq(answer.questionId, questionIndex))
      )
  ).at(0);
};

export const updateAnswer = async (
  questionIndex: number,
  userId: string,
  {
    selectedAnswer,
    time,
    correct,
  }: { selectedAnswer: number; time: number; correct: boolean }
) => {
  await db.update(answer)
    .set({
      answer: selectedAnswer,
      time: time,
      correct,
    })
    .where(
      and(eq(answer.userId, userId), eq(answer.questionId, questionIndex))
    );
};

export const addAnswer = async (
  questionIndex: number,
  userId: string,
  {
    selectedAnswer,
    time,
    correct,
  }: { selectedAnswer: number; time: number; correct: boolean }
) => {
  await db.insert(answer).values({
    userId: userId,
    questionId: questionIndex,
    answer: selectedAnswer,
    time: time,
    correct: correct,
  });
};
