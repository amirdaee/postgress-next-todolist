'use client';

import { useActionState } from 'react';
import { addTodo, completeTodo, deleteTodo } from './actions';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { Todo } from '@/lib/db/queries';
import { error } from 'console';
import { MdDoneOutline, MdRemoveDone  } from "react-icons/md";

// Define the state type
interface FormState {
  input?: string;
  message: string;
  error?: boolean;
}

export async function handelForm(prevState: FormState, formData: FormData): Promise<FormState> {
      const actionType = formData.get('_action');
      
      if (actionType === 'add') {
        return await addTodo(prevState, formData);
      } else if (actionType === 'delete') {
        const result = await deleteTodo(prevState, formData)
        return { ...prevState, ...result};
      }
      else if (actionType === 'complete') {
        const result = await completeTodo(prevState, formData);
        return { ...prevState, ...result};
      }
      
      return prevState;
    }

export default function TodoList({ initialTodos }: { initialTodos: Todo[] }) {
  const [state, dispatchAction, isPending] = useActionState(
    handelForm,
    {
      input: '',
      message: '',
    }
  );

  return (
    <div className="space-y-4">
      <form action={dispatchAction} className="flex mb-4">
        <input type="hidden" name="_action" value="add" />
        <input
          type="text"
          name="todo"
          defaultValue={state.input || ''}
          placeholder="یک تسک جدید اضافه کنید"
          className="flex-grow mr-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600 text-gray-200 text-base"
        />
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600 disabled:opacity-50 text-sm font-medium"
        >
          {isPending ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <Plus className="size-5" />
          )}
        </button>
      </form>
      
      {state.message && (
        <p className={`text-sm mb-2 text-center ${
          state.error ? 'text-red-500' : 'text-green-400'
        }`}>
          {state.message}
        </p>
      )}
      
      <ul className="space-y-2">
        {initialTodos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between py-2 px-4 rounded-lg bg-gray-800 shadow-sm"
          >
            <span className={`text-gray-200 text-sm 
            ${
              todo.is_complete ? 'line-through text-gray-500' : ''
            }`}>{todo.text}</span>
            
            <div className="flex items-center gap-1">
              <form action={dispatchAction}>
                <input type="hidden" name="_action" value="complete" />
                <input type="hidden" name="id" value={todo.id} />
                <button
                  type="submit"
                  className="text-gray-400 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-600 rounded-md p-1 disabled:opacity-50"
                >
                  {todo.is_complete? <MdRemoveDone className="w-5 h-5" />: <MdDoneOutline className="w-5 h-5" />}
                </button>
              </form>

              <form action={dispatchAction}>
                <input type="hidden" name="_action" value="delete" />
                <input type="hidden" name="id" value={todo.id} />
                <button
                  type="submit"
                  className="text-gray-400 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-600 rounded-md p-1 disabled:opacity-50"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                
              </form>
            </div>
            
          </li>
        ))}
      </ul>
    </div>
  );
}
// 'use client';

// import { useActionState } from 'react';
// import { addTodo, deleteTodo } from './actions';
// import { Loader2, Plus, Trash2 } from 'lucide-react';
// import { Todo } from '@/lib/db/queries';

// export default function TodoList({ initialTodos }: { initialTodos: Todo[] }) {
//   const [addState, addAction, isAddPending] = useActionState(addTodo, {
//     input: '',
//     message: '',
//   });
//   const [_, deleteAction] = useActionState(deleteTodo, {
//     message: '',
//   });

//   return (
//     <div className="space-y-4">
//       <form action={addAction} className="flex mb-4">
//         <input
//           type="text"
//           name="todo"
//           defaultValue={addState.input || ''}
//           placeholder="Add a new todo"
//           className="flex-grow mr-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600 text-gray-200 text-base"
//         />
//         <button
//           type="submit"
//           disabled={isAddPending}
//           className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600 disabled:opacity-50 text-sm font-medium"
//         >
//           {isAddPending ? (
//             <Loader2 className="size-5 animate-spin" />
//           ) : (
//             <Plus className="size-5" />
//           )}
//         </button>
//       </form>
//       {addState.message && (
//         <p className={`text-sm mb-2 ${
//           addState.error ? 'text-red-500' : 'text-gray-400'
//         }`}>
//           {addState.message}
//         </p>
//       )}
//       <ul className="space-y-2">
//         {initialTodos.map((todo) => (
//           <li
//             key={todo.id}
//             className="flex items-center justify-between py-2 px-4 rounded-lg bg-gray-800 shadow-sm"
//           >
//             <span className="text-gray-200 text-sm">{todo.text}</span>
//             <form action={deleteAction}>
//               <input type="hidden" name="id" value={todo.id} />
//               <button
//                 type="submit"
//                 className="text-gray-400 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-600 rounded-md p-1 disabled:opacity-50"
//               >
//                 <Trash2 className="w-5 h-5" />
//               </button>
//             </form>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
