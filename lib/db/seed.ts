import { db } from './drizzle';
import { todos, users } from './schema';
import { seed } from 'drizzle-seed';

async function main() {

  await db.delete(users);
  await db.delete(todos);

  const userData = [
    {
      name: 'امیر دائی',
      email: 'amir@skillpro.ir',
      role: 'admin',
      status: 'active',
      createdAt: new Date('2025-11-06 23:28:15.177451'),
    },
    {
      name: 'شهریار سجادی',
      email: 'shahriar@skillpro.ir',
      role: 'author',
      status: 'active',
      createdAt: new Date('2025-11-06 23:50:46.175192'),
    },
    {
      name: 'علی صبوری',
      email: 'ali@skillpro.ir',
      role: 'editor',
      status: 'active',
      createdAt: new Date('2025-11-07 00:42:52.891281'),
    },
  ];

  // درج کاربران در دیتابیس
  for (const user of userData) {
    await db.insert(users).values(user);
    console.log(`User added: ${user.name}`);
  }

  await seed(db, { todos }).refine((f) => ({
    todos: {
      columns: {
        text: f.loremIpsum(),
      },
      count: 5,
    },
  }));
  process.exit();
}

main();
