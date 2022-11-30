require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

app.use(express.static("build"));
app.use(express.json());
app.use(cors());

morgan.token("body", (request) => {
  return JSON.stringify(request.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

const generateId = () => {
  const id = Math.floor(Math.random() * 1000000);
  return id;
};

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
];

app.get("/info", (request, response) => {
  const date = new Date();
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p>
        <p>${date}</p>`
  );
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((result) => {
    response.json(result);
  });
});

app.get("/api/persons/:id", (request, response) => {
  /* const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person === undefined) {
    return response.status(404).json({
      error: "no name with given id",
    });
  }
  response.json(person); */
  Person.findById(request.params.id).then((person) => {
    response.json(person);
  });
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body.number) {
    return response.status(400).json({
      error: "number missing",
    });
  } else if (!body.name) {
    return response.status(400).json({
      error: "name missing",
    });
  } else if (
    persons.find(
      (person) => person.name.toLowerCase() === body.name.toLowerCase()
    ) !== undefined
  ) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const person = new Person({
    number: body.number,
    name: body.name,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
