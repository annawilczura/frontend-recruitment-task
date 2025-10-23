import axios from "axios";

const API_URL = "http://localhost:3000";

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

export type ErrorResponse = {
  message: string;
};

export type ApiResponse<T> = {
  data: T | null;
  error: ErrorResponse | null;
};

const apiClient = axios.create({
  baseURL: API_URL,
});

export const getTodos = async (): Promise<ApiResponse<Todo[]>> => {
  try {
    const response = await apiClient.get<Todo[]>("/todos");
    return { data: response.data, error: null };
  } catch (error) {
    console.error("Error fetching todos:", error);
    let errorMessage = "An unexpected error occurred while fetching todos.";
    if (axios.isAxiosError(error)) {
      errorMessage = error.message;
    }
    return { data: null, error: { message: errorMessage } };
  }
};

export const addTodo = async (title: string): Promise<ApiResponse<Todo>> => {
  try {
    const response = await apiClient.post<Todo>("/todos", { title });
    return { data: response.data, error: null };
  } catch (error) {
    console.error("Error adding todo:", error);
    let errorMessage = "An unexpected error occurred while adding the todo.";
    if (axios.isAxiosError(error)) {
      if (error.response) {
        errorMessage = `Error: ${error.response.status} ${error.response.statusText}`;
      } else if (error.request) {
        errorMessage = "The server did not respond. Please try again later.";
      } else {
        errorMessage = error.message;
      }
    }
    return { data: null, error: { message: errorMessage } };
  }
};

export const updateTodo = async (
  id: string,
  updates: Partial<Omit<Todo, "id">>,
): Promise<ApiResponse<Todo>> => {
  try {
    const response = await apiClient.put<Todo>(`/todos/${id}`, updates);
    return { data: response.data, error: null };
  } catch (error) {
    console.error(`Error updating todo ${id}:`, error);
    let errorMessage = "An unexpected error occurred while updating the todo.";
    if (axios.isAxiosError(error)) {
      if (error.response) {
        errorMessage = `Error: ${error.response.status} ${error.response.statusText}`;
      } else if (error.request) {
        errorMessage = "The server did not respond. Please try again later.";
      } else {
        errorMessage = error.message;
      }
    }
    return { data: null, error: { message: errorMessage } };
  }
};

export const deleteTodo = async (
  id: string,
): Promise<ApiResponse<{ success: boolean }>> => {
  try {
    await apiClient.delete(`/todos/${id}`);
    return { data: { success: true }, error: null };
  } catch (error) {
    console.error(`Error deleting todo ${id}:`, error);
    let errorMessage = "An unexpected error occurred while deleting the todo.";
    if (axios.isAxiosError(error)) {
      if (error.response) {
        errorMessage = `Error: ${error.response.status} ${error.response.statusText}`;
      } else if (error.request) {
        errorMessage = "The server did not respond. Please try again later.";
      } else {
        errorMessage = error.message;
      }
    }
    return { data: null, error: { message: errorMessage } };
  }
};

export const deleteAllTodos = async (): Promise<
  ApiResponse<{ success: boolean }>
> => {
  try {
    await apiClient.delete("/todos");
    return { data: { success: true }, error: null };
  } catch (error) {
    console.error("Error deleting all todos:", error);
    let errorMessage = "An unexpected error occurred while deleting all todos.";
    if (axios.isAxiosError(error)) {
      if (error.response) {
        errorMessage = `Error: ${error.response.status} ${error.response.statusText}`;
      } else if (error.request) {
        errorMessage = "The server did not respond. Please try again later.";
      } else {
        errorMessage = error.message;
      }
    }
    return { data: null, error: { message: errorMessage } };
  }
};
