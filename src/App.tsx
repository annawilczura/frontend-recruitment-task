import { clsx } from "clsx";
import * as todoService from "./services/todoService";
import { useState, FormEvent, useEffect } from "react";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

export function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState("");

  useEffect(() => {
    const fetchTodos = async () => {
      const response = await todoService.getTodos();
      if (response && response.data) {
        setTodos(response.data);
      }
    };

    fetchTodos();
  }, []);

  const handleAddTodo = async (event: FormEvent) => {
    event.preventDefault();
    const response = await todoService.addTodo(newTodoTitle);
    if (response && response.data) {
      setTodos([...todos, response.data]);
      setNewTodoTitle("");
    }
  };

  const handleToggleCompleted = async (id: string, completed: boolean) => {
    const response = await todoService.updateTodo(id, { completed });
    if (response.data) {
      const updatedTodo = response.data;
      setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
    }
  };

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 p-4">
      <form onSubmit={handleAddTodo}>
        <input
          placeholder="What needs to be done?"
          type="text"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
        />
      </form>

      <fieldset>
        <legend className="text-base font-semibold leading-6 text-gray-900">
          Todo list
        </legend>
        <div className="mt-4 divide-y divide-gray-200 border-b border-t border-gray-200">
          {todos.map((todo) => (
            <div
              key={todo.id}
              data-testid="todo-item"
              className={clsx(
                "relative flex items-start py-4",
                // todo.completed && "line-through",
              )}
            >
              <div className="min-w-0 flex-1 text-sm leading-6">
                <label
                  className="select-none font-medium text-gray-900"
                  data-testid="todo-title"
                >
                  {todo.title}
                </label>
              </div>
              <div className="ml-3 flex h-6 items-center">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  onChange={() =>
                    handleToggleCompleted(todo.id, !todo.completed)
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </fieldset>

      <div className="flex h-8 items-center justify-between">
        <span
          data-testid="todo-count"
          className="text-sm font-medium leading-6 text-gray-900"
        >
          {todos.length} items left
        </span>
        <button className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          Clear completed
        </button>
      </div>
    </div>
  );
}
