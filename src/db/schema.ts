import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
  userId: text("userId").primaryKey(), // simply `${name}#{secret}`
});

export type User = InferSelectModel<typeof user>;
export type InsertCartState = InferInsertModel<typeof user>;

export const question = sqliteTable("question", {
  questionId: integer("id").primaryKey(),
  question: text("question").notNull(),
  answer1: text("answer1").notNull(),
  answer2: text("answer2").notNull(),
  answer3: text("answer3").notNull(),
  answer4: text("answer4").notNull(),
  correctAnswer: integer("correctAnswer").notNull(),
  duration: integer("duration").notNull(),
  startTime: integer("timestamp", {mode: "timestamp"}),
});

export type Question = InferSelectModel<typeof question>;

export const answer = sqliteTable(
  "answer",
  {
    userId: text("userId").notNull().references(() => user.userId),
    questionId: integer("questionId").notNull().references(() => question.questionId),
    answer: integer("answer").notNull(),
    time: integer("time").notNull(),
    correct: integer("correct", {mode: "boolean"}).notNull(),
  },
  (table) => {
    return {
      pk: primaryKey(table.userId, table.questionId),
    };
  }
);

export type Answer = InferSelectModel<typeof answer>;
