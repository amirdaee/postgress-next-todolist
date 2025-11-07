import { getUsers } from '@/lib/db/queries';
import UsersClient from './users-client';

export default async function UsersPage() {
  const users = await getUsers();
  
  // فرمت‌دهی داده‌ها برای نمایش
  const formattedUsers = users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role === 'admin' ? 'مدیر' : 
          user.role === 'author' ? 'نویسنده' : 
          user.role === 'editor' ? 'ویرایشگر' : 'کاربر',
    status: user.status === 'active' ? 'فعال' : 'غیرفعال',
    joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString('fa-IR') : 'نامشخص'
  }));

  return <UsersClient initialUsers={formattedUsers} />;
}