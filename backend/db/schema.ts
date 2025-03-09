import { drizzle } from "drizzle-orm/node-postgres";
import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const db = drizzle(process.env.DATABASE_URL!);

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
});
