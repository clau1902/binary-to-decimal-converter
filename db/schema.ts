import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const searches = pgTable("searches", {
  id: serial("id").primaryKey(),
  inputType: varchar("input_type", { length: 20 }).notNull(), // 'binary' or 'hexadecimal'
  inputValue: text("input_value").notNull(),
  decimalResult: text("decimal_result").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Search = typeof searches.$inferSelect;
export type NewSearch = typeof searches.$inferInsert;

