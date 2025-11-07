import { asc, desc } from 'drizzle-orm/sql';
import { db } from './drizzle';
import { todos, users  } from './schema';
import { InferSelectModel } from 'drizzle-orm';
import { todo } from 'node:test';

export type Todo = InferSelectModel<typeof todos>;
export type User = InferSelectModel<typeof users>;

export async function getTodos() {
  return db
    .select({
      id: todos.id,
      text: todos.text,
      is_complete: todos.is_complete,
      createdAt: todos.createdAt,
      updatedAt: todos.updatedAt,
    })
    .from(todos)
    .orderBy(asc(todos.is_complete, desc(todos.updatedAt)));
}

export async function getUsers() {
  try {
    const allUsers = await db.select().from(users);
    return allUsers;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}