const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.send(repositories);
});

app.post("/repositories", (request, response) => {
  const { url, title, techs } = request.body;
  const repository = {
    id: uuid(),
    url,
    title,
    techs,
    likes: 0,
  };
  repositories.push(repository);
  return response.send(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { url, title, techs } = request.body;
  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ message: "Repository no foun." });
  }
  const likes = repositories[repositoryIndex].likes;

  const repositoryPut = {
    id,
    url,
    title,
    techs,
    likes,
  };

  repositories[repositoryIndex] = repositoryPut;
  return response.send(repositoryPut);
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return res.status(400).json({ message: "Repository no found." });
  }

  repositories.splice(repositoryIndex, 1);

  return res.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const { likes: allowed } = request.body;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ message: "Repository no found." });
  }

  if (allowed > 1) {
    return response.status(400).json({ message: "Action not allowed." });
  }
  const { url, title, techs, likes } = repositories[repositoryIndex];
  const repository = {
    id,
    url,
    title,
    techs,
    likes: likes + 1,
  };

  repositories[repositoryIndex] = repository;
  return response.send(repository);
});

module.exports = app;
