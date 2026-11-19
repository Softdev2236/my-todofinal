
import { pgTable,serial,text,boolean,timestamp } from "drizzle-orm/pg-core";

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  priority: text('priority').notNull(),
  dueDate: text('due_date').notNull(),
  status:text('status').default('todo').notNull(),
  completed: boolean('completed').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;