import Link from 'next/link';
import { notFound } from 'next/navigation';

// داده‌های فیک
const fakeUsers = [
  {
    id: 1,
    name: 'امیر محمدی',
    email: 'amir@example.com',
    role: 'مدیر',
    status: 'فعال',
    joinDate: '۱۴۰۲/۰۱/۱۵',
    bio: 'توسعه‌دهنده full-stack با ۵ سال تجربه در زمینه وب',
    phone: '09123456789'
  },
  {
    id: 2,
    name: 'سارا احمدی',
    email: 'sara@example.com',
    role: 'کاربر',
    status: 'فعال',
    joinDate: '۱۴۰۲/۰۲/۲۰',
    bio: 'طراح UI/UX',
    phone: '09129876543'
  }
];

// Remove the interface and make the component async
export default async function UserDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // Await the params promise
  const { id } = await params;
  
  const user = fakeUsers.find(u => u.id === parseInt(id));

  if (!user) {
    notFound();
  }

  return (
    <div className="min-h-screen p-8 bg-gray-900">
      <div className="max-w-2xl mx-auto">
        <Link 
          href="/users"
          className="inline-block mb-6 px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 transition-colors"
        >
          ← بازگشت به لیست کاربران
        </Link>

        <div className="bg-gray-800 rounded-lg p-8 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-100">پروفایل کاربر</h1>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                user.status === 'فعال'
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              }`}
            >
              {user.status}
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
              <span className="text-gray-400">نام کامل:</span>
              <span className="text-gray-100 font-medium">{user.name}</span>
            </div>

            <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
              <span className="text-gray-400">ایمیل:</span>
              <span className="text-gray-100">{user.email}</span>
            </div>

            <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
              <span className="text-gray-400">نقش:</span>
              <span className="text-gray-100">{user.role}</span>
            </div>

            <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
              <span className="text-gray-400">تاریخ عضویت:</span>
              <span className="text-gray-100">{user.joinDate}</span>
            </div>

            {'bio' in user && (
              <div className="p-4 bg-gray-700/50 rounded-lg">
                <span className="text-gray-400 block mb-2">درباره:</span>
                <span className="text-gray-100">{user.bio}</span>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-8">
            <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              ویرایش پروفایل
            </button>
            <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
              غیرفعال کردن
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}