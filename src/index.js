const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
}

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
    todos: [],
  });

  return response.status(201).json(users);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;

/*
- Criar um novo *todo*;
- Listar todos os *todos*;
- Alterar o `title` e `deadline` de um *todo* existente;
- Marcar um *todo* como feito;
- Excluir um *todo*;

Tudo isso para cada usuário em específico 
*/
