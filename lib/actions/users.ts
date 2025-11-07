'use server';

import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/schema';

export async function addUser(prevState: any, formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const role = formData.get('role') as string;

    // اعتبارسنجی فیلدهای اجباری
    if (!name?.trim()) {
      return {
        message: 'نام کاربر الزامی است',
        error: true,
        fieldErrors: { name: 'نام نمی‌تواند خالی باشد' }
      };
    }

    if (!email?.trim()) {
      return {
        message: 'ایمیل کاربر الزامی است',
        error: true,
        fieldErrors: { email: 'ایمیل نمی‌تواند خالی باشد' }
      };
    }

    // اعتبارسنجی طول
    if (name.length > 100) {
      return {
        message: 'نام نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد',
        error: true,
        fieldErrors: { name: 'نام بسیار طولانی است' }
      };
    }

    if (email.length > 100) {
      return {
        message: 'ایمیل نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد',
        error: true,
        fieldErrors: { email: 'ایمیل بسیار طولانی است' }
      };
    }

    // اعتبارسنجی فرمت ایمیل
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        message: 'فرمت ایمیل نامعتبر است',
        error: true,
        fieldErrors: { email: 'لطفاً یک ایمیل معتبر وارد کنید' }
      };
    }

    // بررسی تکراری نبودن ایمیل
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return {
        message: 'این ایمیل قبلاً ثبت شده است',
        error: true,
        fieldErrors: { email: 'ایمیل تکراری است' }
      };
    }

    // اضافه کردن کاربر به دیتابیس
    await db.insert(users).values({
      name: name.trim(),
      email: email.trim(),
      role: role || 'user',
      status: 'active'
    });

    revalidatePath('/users');
    return {
      message: 'کاربر با موفقیت اضافه شد',
      error: false,
      fieldErrors: {}
    };

  } catch (error) {
    console.error('Error adding user:', error);
    return {
      message: 'خطا در اضافه کردن کاربر',
      error: true,
      fieldErrors: {}
    };
  }
}

export async function deleteUser(prevState: any, formData: FormData) {
  try {
    const id = formData.get('id') as string;

    if (!id) {
      return { message: 'شناسه کاربر نامعتبر است', error: true };
    }

    await db.delete(users).where(eq(users.id, parseInt(id)));

    revalidatePath('/users');
    return { message: 'کاربر با موفقیت حذف شد', error: false };

  } catch (error) {
    console.error('Error deleting user:', error);
    return { message: 'خطا در حذف کاربر', error: true };
  }
}

export async function updateUser(prevState: any, formData: FormData) {
  try {
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const role = formData.get('role') as string;
    const status = formData.get('status') as string;

    // اعتبارسنجی فیلدهای اجباری
    if (!name?.trim()) {
      return {
        message: 'نام کاربر الزامی است',
        error: true,
        fieldErrors: { name: 'نام نمی‌تواند خالی باشد' }
      };
    }

    if (!email?.trim()) {
      return {
        message: 'ایمیل کاربر الزامی است',
        error: true,
        fieldErrors: { email: 'ایمیل نمی‌تواند خالی باشد' }
      };
    }

    // اعتبارسنجی طول
    if (name.length > 100) {
      return {
        message: 'نام نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد',
        error: true,
        fieldErrors: { name: 'نام بسیار طولانی است' }
      };
    }

    if (email.length > 100) {
      return {
        message: 'ایمیل نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد',
        error: true,
        fieldErrors: { email: 'ایمیل بسیار طولانی است' }
      };
    }

    // اعتبارسنجی فرمت ایمیل
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        message: 'فرمت ایمیل نامعتبر است',
        error: true,
        fieldErrors: { email: 'لطفاً یک ایمیل معتبر وارد کنید' }
      };
    }

    // بررسی تکراری نبودن ایمیل (به جز برای کاربر فعلی)
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0 && existingUser[0].id !== parseInt(id)) {
      return {
        message: 'این ایمیل قبلاً توسط کاربر دیگری ثبت شده است',
        error: true,
        fieldErrors: { email: 'ایمیل تکراری است' }
      };
    }

    // آپدیت کاربر در دیتابیس
    await db
      .update(users)
      .set({
        name: name.trim(),
        email: email.trim(),
        role: role || 'user',
        status: status || 'active'
      })
      .where(eq(users.id, parseInt(id)));

    revalidatePath('/users');
    return {
      message: 'کاربر با موفقیت ویرایش شد',
      error: false,
      fieldErrors: {}
    };

  } catch (error) {
    console.error('Error updating user:', error);
    return {
      message: 'خطا در ویرایش کاربر',
      error: true,
      fieldErrors: {}
    };
  }
}