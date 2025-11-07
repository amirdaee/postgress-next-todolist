import { boolean,pgTable, varchar,serial, timestamp, uuid } from 'drizzle-orm/pg-core';
import { Fascinate } from 'next/font/google';

export const todos = pgTable('todos', {
  id: uuid('id').defaultRandom().primaryKey(),
  text: varchar('text', { length: 255 }).notNull(),
  is_complete: boolean().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  role: varchar('role', { length: 50 }).notNull().default('user'),
  status: varchar('status', { length: 20 }).notNull().default('active'),
  createdAt: timestamp('created_at').defaultNow(),
});