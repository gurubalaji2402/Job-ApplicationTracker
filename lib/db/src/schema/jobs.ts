import { pgTable, serial, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const jobStatusEnum = pgEnum("job_status", [
  "wishlist",
  "applied",
  "interviewing",
  "offer",
  "rejected",
  "withdrawn",
]);

export const jobsTable = pgTable("jobs", {
  id: serial("id").primaryKey(),
  company: text("company").notNull(),
  role: text("role").notNull(),
  status: jobStatusEnum("status").notNull().default("wishlist"),
  location: text("location"),
  url: text("url"),
  salary: text("salary"),
  notes: text("notes"),
  appliedAt: timestamp("applied_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertJobSchema = createInsertSchema(jobsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateJobSchema = insertJobSchema.partial();

export type InsertJob = z.infer<typeof insertJobSchema>;
export type UpdateJob = z.infer<typeof updateJobSchema>;
export type Job = typeof jobsTable.$inferSelect;
