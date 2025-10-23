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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await todoService.getTodos();
        if (response.data) {
          setTodos(response.data);
        } else if (response.error) {
          setError(response.error.message);
        }
      } catch (error) {
        setError("An unexpected error occurred while fetching todos.");
        console.error("Failed to fetch todos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const handleAddTodo = async (event: FormEvent) => {
    event.preventDefault();
    if (!newTodoTitle.trim()) {
      return;
    }
    const response = await todoService.addTodo(newTodoTitle);
    if (response.data) {
      setTodos([...todos, response.data]);
      setNewTodoTitle("");
      setError(null);
    } else if (response.error) {
      setError(response.error.message);
    }
  };

  const handleToggleCompleted = async (id: string, completed: boolean) => {
    const response = await todoService.updateTodo(id, { completed });
    if (response.data) {
      const updatedTodo = response.data;
      setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
      setError(null);
    } else if (response.error) {
      setError(response.error.message);
    }
  };

  const handleClearCompleted = async () => {
    const completedTodoIds = todos
      .filter((todo) => todo.completed)
      .map((todo) => todo.id);
    const deletePromises = completedTodoIds.map((id) =>
      todoService.deleteTodo(id),
    );

    const responses = await Promise.all(deletePromises);

    const firstError = responses.find((response) => response.error);

    if (firstError && firstError.error) {
      setError(firstError.error.message);
    } else {
      setTodos(todos.filter((todo) => !todo.completed));
      setError(null);
    }
  };

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 p-4">
      {error && (
        <div
          className="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
          role="alert"
        >
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      <form onSubmit={handleAddTodo}>
        <input
          placeholder="What needs to be done?"
          type="text"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
        />
      </form>

      {isLoading ? (
        <div className="flex justify-center p-4">
          <p className="text-gray-500">Loading todos...</p>
        </div>
      ) : (
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
                  todo.completed && "line-through",
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
      )}

      <div className="flex h-8 items-center justify-between">
        <span
          data-testid="todo-count"
          className="text-sm font-medium leading-6 text-gray-900"
        >
          {todos.length} items left
        </span>
        {todos.some((todo) => todo.completed) && (
          <button
            onClick={handleClearCompleted}
            className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Clear completed
          </button>
        )}
      </div>
    </div>
  );
}
