import { getTodos } from '@/lib/db/queries';
import TodoList from './todo-list';
import Link from 'next/link';


// This will be replaced by 'use cache' soon
export const dynamic = 'force-static';

export default async function Home() {
  const todos = await getTodos();

  return (
    <div className="min-h-screen p-8 bg-gray-900">
      <div className="max-w-6xl mx-auto">
      {/* هدر صفحه */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-100">پروژه نمونه next.js و postgress</h1>
          <Link 
            href="/users"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            مشاهده کاربران
          </Link>
        </div>
      </div>
      
      <main className="max-w-[350px] mx-auto">
        

        {/* لینک به صفحه کاربران */}
        <TodoList initialTodos={todos} />
        
      </main>
    </div>
  );
}
