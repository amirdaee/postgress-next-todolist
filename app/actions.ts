'use server';

import { revalidatePath } from 'next/cache';
import { eq, sql } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import { todos } from '@/lib/db/schema';
import { error } from 'console';

export async function addTodo(_: any, formData: FormData) {
  const text = formData.get('todo') as string;
   // بررسی طول متن
    if (text.length > 100) {
      return { 
        message: 'حداکثر عنوان تسک 100 کاراکتر است', 
        input: text,
        error: true
      };
    }

  if (text.trim()) {
    await db.insert(todos).values({ text });
    revalidatePath('/');
    return { message: 'تسک با موفقیت ثبت شد', input: '' };
  }

  return { message: 'عنوان نمی توان خالی باشد', input: text , error: true};
}

export async function deleteTodo(_: any, formData: FormData) {
  const id = formData.get('id') as string;

  await db.delete(todos).where(eq(todos.id, id));

  revalidatePath('/');
  return { message: 'تسک با موافقیت حذف شد', error: false };
}

export async function completeTodo(_: any, formData: FormData) {
  const id = formData.get('id') as string;
  
  // اول مقدار فعلی را بگیر
  const currentTodo = await db
    .select({ is_complete: todos.is_complete })
    .from(todos)
    .where(eq(todos.id, id))
    .limit(1);

  if (currentTodo.length === 0) {
    return { message: 'تسک پیدا نشد', error: true };
  }

  // سپس با مقدار مخالف آپدیت کن
  await db
    .update(todos)
    .set({
      is_complete: !currentTodo[0].is_complete
    })
    .where(eq(todos.id, id));

  const newStatus = !currentTodo[0].is_complete;
  revalidatePath('/');
  return { 
    message: newStatus ? 'تسک کامل شد' : 'تسک به حالت ناتمام برگشت',
    error: false 
  };
}
