import Fastify from "fastify";
import cors from "@fastify/cors";
import { v4 as uuidv4 } from "uuid";

const fastify = Fastify({
  logger: false,
});

await fastify.register(cors, {});

let todos = [];

fastify.get("/todos", (request, reply) => {
  reply.send(todos);
});

// Get a single todo by ID
fastify.get("/todos/:id", (request, reply) => {
  const { id } = request.params;
  const todo = todos.find((todo) => todo.id === id);
  if (todo) {
    reply.send(todo);
  } else {
    reply.status(404).send({ message: "Todo not found" });
  }
});

fastify.post("/todos", (request, reply) => {
  const { title } = request.body;
  const newTodo = {
    id: uuidv4(),
    title,
    completed: false,
  };
  todos.push(newTodo);
  reply.status(201).send(newTodo);
});

// Update a todo
fastify.put("/todos/:id", (request, reply) => {
  const { id } = request.params;
  const { title, completed } = request.body;
  const todo = todos.find((todo) => todo.id === id);
  if (todo) {
    todo.title = title !== undefined ? title : todo.title;
    todo.completed = completed !== undefined ? completed : todo.completed;
    reply.send(todo);
  } else {
    reply.status(404).send({ message: "Todo not found" });
  }
});

// Delete a todo
fastify.delete("/todos/:id", (request, reply) => {
  const { id } = request.params;
  todos = todos.filter((todo) => todo.id !== id);
  reply.status(204).send();
});

// Delete all todos
fastify.delete("/todos", (request, reply) => {
  todos = [];
  reply.status(201).send();
});

// Run the server!
fastify.listen({ port: 3000 }, function (err) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
