const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

users.push({
  id: uuidv4(),
  name: "Usuário de Teste",
  username: "testuser",
  todoList: [],
});

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find((user) => user.username === username);

  if (!user) {
    return response.status(404).json({ error: "User not found!" });
  }
  request.user = user;

  return next();
}

function findTodo(todoList, id) {
  const todo = todoList.findIndex((todo) => todo.id === id);
  return todo;
}
//rotas de usuário
//cria usuário
app.post("/users", (request, response) => {
  const { name, username } = request.body;

  const userExists = users.some((user) => user.username === username);

  if (userExists) {
    return response.status(400).json({ error: "User already exists!" });
  }

  users.push({
    id: uuidv4(),
    name,
    username,
    todoList: [],
  });

  return response.status(201).json(users);
});

//rotas de todos
//cria todo
app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { user } = request;

  const newTodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };
  user.todoList.push(newTodo);

  return response.status(201).send();
});

//lista todos de um usuáro
app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  return response.json(user.todoList);
});

//atualiza todo
app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { user } = request;
  const { id } = request.params;

  const todoIndex = findTodo(user.todoList, id);

  if (todoIndex === -1) {
    return response.status(404).json({ error: "Todo not found!" });
  }

  user.todoList[todoIndex].title = title;
  user.todoList[todoIndex].deadline = new Date(deadline);
  return response.status(201).send();
});

//atualiza "done" do todo
app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todoIndex = findTodo(user.todoList, id);

  if (todoIndex === -1) {
    return response.status(404).json({ error: "Todo not found!" });
  }

  user.todoList[todoIndex].done = true;
  return response.status(201).send();
});

//deleta todo
app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todoIndex = findTodo(user.todoList, id);

  if (todoIndex === -1) {
    return response.status(404).json({ error: "Todo not found!" });
  } else {
    user.todoList.splice(todoIndex, 1);
    return response.status(201).send();
  }
});

module.exports = app;
