'use client';

import { useActionState, useEffect, useState } from 'react';
import Link from 'next/link';
import { addUser, deleteUser, updateUser } from '@/lib/actions/users';
import { Loader2, Plus, UserPlus, Edit, X } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  joinDate: string;
}

interface UsersClientProps {
  initialUsers: User[];
}

// تابع مدیریت فرم‌ها
async function handleUserActions(prevState: any, formData: FormData) {
  const actionType = formData.get('_action');
  
  if (actionType === 'add') {
    return await addUser(prevState, formData);
  } else if (actionType === 'delete') {
    const result = await deleteUser(prevState, formData);
    if (result.message && !result.error) {
      return { ...prevState, message: 'حذف با موفقیت انجام شد', error: false };
    }
    return { ...prevState, ...result };
  } else if (actionType === 'update') {
    const result = await updateUser(prevState, formData);
    if (result.message && !result.error) {
      return { ...prevState, message: 'ویرایش با موفقیت انجام شد', error: false };
    }
    return { ...prevState, ...result };
  }
  
  return prevState;
}

export default function UsersClient({ initialUsers }: UsersClientProps) {
  const [state, dispatchAction, isPending] = useActionState(
    handleUserActions,
    {
      message: '',
      error: false,
      fieldErrors: {},
      input: ''
    }
  );

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // محاسبه آمار
  const totalUsers = initialUsers.length;
  const activeUsers = initialUsers.filter(user => user.status === 'فعال').length;
  const adminUsers = initialUsers.filter(user => user.role === 'مدیر').length;

  // تابع باز کردن مودال ویرایش
  const openEditModal = (user: User) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  // تابع بستن مودال
  const closeEditModal = () => {
    setEditingUser(null);
    setIsEditModalOpen(false);
  };

  // تابع برای تبدیل نقش به مقدار دیتابیس
  const getRoleValue = (role: string): string => {
    const roleMap: { [key: string]: string } = {
      'مدیر': 'admin',
      'نویسنده': 'author',
      'ویرایشگر': 'editor',
      'کاربر': 'user'
    };
    return roleMap[role] || 'user';
  };

  // تابع برای تبدیل وضعیت به مقدار دیتابیس
  const getStatusValue = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      'فعال': 'active',
      'غیرفعال': 'inactive'
    };
    return statusMap[status] || 'active';
  };

  return (
    <div className="min-h-screen p-8 bg-gray-900">
      <div className="max-w-6xl mx-auto">

        {/* هدر صفحه */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-100">مدیریت کاربران</h1>
          <Link 
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            بازگشت به لیست کارها
          </Link>
        </div>

        {/* آمار */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-green-400">{totalUsers}</div>
            <div className="text-gray-400 mt-2">تعداد کل کاربران</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-blue-400">{activeUsers}</div>
            <div className="text-gray-400 mt-2">کاربران فعال</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-purple-400">{adminUsers}</div>
            <div className="text-gray-400 mt-2">مدیران سیستم</div>
          </div>
        </div>

        {/* فرم اضافه کردن کاربر */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700">
          <h2 className="text-xl font-semibold text-gray-100 mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            اضافه کردن کاربر جدید
          </h2>

          <form action={dispatchAction} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="hidden" name="_action" value="add" />
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                نام کاربر *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  state.fieldErrors?.name ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="نام کامل کاربر"
              />
              {state.fieldErrors?.name && (
                <p className="mt-1 text-sm text-red-400">{state.fieldErrors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                ایمیل *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  state.fieldErrors?.email ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="example@email.com"
              />
              {state.fieldErrors?.email && (
                <p className="mt-1 text-sm text-red-400">{state.fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">
                نقش
              </label>
              <select
                id="role"
                name="role"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="user">کاربر عادی</option>
                <option value="admin">مدیر</option>
                <option value="author">نویسنده</option>
                <option value="editor">ویرایشگر</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <button
                type="submit"
                disabled={isPending}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center gap-2"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                {isPending ? 'در حال اضافه کردن...' : 'اضافه کردن کاربر'}
              </button>
            </div>
          </form>

          {/* نمایش پیام */}
          {state.message && (
            <div className={`mt-4 p-3 rounded-md ${
              state.error ? 'bg-red-500/20 border border-red-500' : 'bg-green-500/20 border border-green-500'
            }`}>
              <p className={`text-sm ${
                state.error ? 'text-red-400' : 'text-green-400'
              }`}>
                {state.message}
              </p>
            </div>
          )}
        </div>

        {/* کارت‌های کاربران */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {initialUsers.map((user) => (
            <div
              key={user.id}
              className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-100">{user.name}</h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.status === 'فعال'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {user.status}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-gray-300">
                  <span className="w-20 text-gray-400">ایمیل:</span>
                  <span className="text-sm dir-ltr text-left">{user.email}</span>
                </div>

                <div className="flex items-center text-gray-300">
                  <span className="w-20 text-gray-400">نقش:</span>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      user.role === 'مدیر'
                        ? 'bg-blue-500/20 text-blue-400'
                        : user.role === 'نویسنده'
                        ? 'bg-purple-500/20 text-purple-400'
                        : user.role === 'ویرایشگر'
                        ? 'bg-orange-500/20 text-orange-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}
                  >
                    {user.role}
                  </span>
                </div>

                <div className="flex items-center text-gray-300">
                  <span className="w-20 text-gray-400">تاریخ عضویت:</span>
                  <span className="text-sm">{user.joinDate}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <button 
                  onClick={() => openEditModal(user)}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                >
                  <Edit className="w-4 h-4" />
                  ویرایش
                </button>
                <form action={dispatchAction}>
                  <input type="hidden" name="_action" value="delete" />
                  <input type="hidden" name="id" value={user.id} />
                  <button
                    type="submit"
                    className="flex-1 px-3 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition-colors"
                  >
                    حذف
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* مودال ویرایش کاربر */}
      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-100 flex items-center gap-2">
                <Edit className="w-5 h-5" />
                ویرایش کاربر
              </h2>
              <button
                onClick={closeEditModal}
                className="text-gray-400 hover:text-gray-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form action={dispatchAction} className="space-y-4">
              <input type="hidden" name="_action" value="update" />
              <input type="hidden" name="id" value={editingUser.id} />
              
              <div>
                <label htmlFor="edit-name" className="block text-sm font-medium text-gray-300 mb-2">
                  نام کاربر *
                </label>
                <input
                  type="text"
                  id="edit-name"
                  name="name"
                  required
                  defaultValue={editingUser.name}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="نام کامل کاربر"
                />
              </div>

              <div>
                <label htmlFor="edit-email" className="block text-sm font-medium text-gray-300 mb-2">
                  ایمیل *
                </label>
                <input
                  type="email"
                  id="edit-email"
                  name="email"
                  required
                  defaultValue={editingUser.email}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <label htmlFor="edit-role" className="block text-sm font-medium text-gray-300 mb-2">
                  نقش
                </label>
                <select
                  id="edit-role"
                  name="role"
                  defaultValue={getRoleValue(editingUser.role)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user">کاربر عادی</option>
                  <option value="admin">مدیر</option>
                  <option value="author">نویسنده</option>
                  <option value="editor">ویرایشگر</option>
                </select>
              </div>

              <div>
                <label htmlFor="edit-status" className="block text-sm font-medium text-gray-300 mb-2">
                  وضعیت
                </label>
                <select
                  id="edit-status"
                  name="status"
                  defaultValue={getStatusValue(editingUser.status)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">فعال</option>
                  <option value="inactive">غیرفعال</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="flex-1 px-4 py-2 bg-gray-600 text-gray-200 rounded-md hover:bg-gray-500 transition-colors"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  onClick={() => {
                    if (!isPending) {
                      setTimeout(() => {
                        closeEditModal();
                      }, 500);
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Edit className="w-4 h-4" />
                  )}
                  {isPending ? 'در حال ویرایش...' : 'ذخیره تغییرات'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}