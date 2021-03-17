//Chamando o express
const { response } = require('express');
const express = require('express');
const { uuid } = require('uuidv4');

const app = express();

app.use(express.json());

const projects = [];

function logRequest(request, response, next) {
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.log(logLabel);

  return next();
}

app.use(logRequest);

// GET

app.get('/projects', (request, response) => {
  const { title } = request.query;

  //console.log(title);
  //console.log(owner);

  const results = title
    ? projects.filter(project => project.title.includes(title))
    : projects;

  return response.json(results);
});

// POST

app.post('/projects', (request, response) => {
  const { title, owner } = request.body;

  const project = { id: uuid(), title, owner };

  projects.push(project);

  return response.json(project);
})

// PUT

app.put('/projects/:id', (request, response) => {
  const { id } = request.params;
  const { title, owner } = request.body;

  const projectIndex = projects.findIndex(project => project.id == id);

  if (projectIndex < 0) {
    return response.status(400).json({ erro: "Project not found." })
  }

  const project = {
    id,
    title,
    owner
  }

  projects[projectIndex] = project;

  return response.json(project);
})

// DELETE

app.delete('/projects/:id', (request, response) => {

  const { id } = request.params;

  const projectIndex = projects.findIndex(project => project.id == id);

  if (projectIndex < 0) {
    return response.status(400).json({ erro: "Project not found." })
  }

  projects.splice(projectIndex, 1);

  return response.status(204).send();
})

//Abrindo localhost na porta 3333
app.listen(3333, () => {
  console.log('✌Back-end started!✌');
});