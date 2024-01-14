const express = require('express');
const bodyParser = require('body-parser');
const PORT = 8000;

// definimos la aplicación
const app = express();

// fijamos que la API consume JSON
app.use(bodyParser.json());


let todos = [
    {id: 1, task: 'Visitar Oracle Málaga'},
    {id: 2, task: 'Aburrirme en Oracle Málaga'}
];

// permitimos servir contenido estático (carpeta public)
app.use('/', express.static('public'));

// enrutador

// listar todas las tareas http://localhost:8000/todos
app.get('/todos', (req, res) => {
  res.json(todos);
});

// listar una tarea por ID http://localhost:8000/todos/{id}
app.get('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN)
    res.status(404);
  else {
    res.json(todos.find(x => x.id === id));
  }
});

// en el request me llega una nueva tarea, que se añade a la lista
app.post('/todos', (req, res) => {
    const tarea = req.body;
    if(tarea.task !== undefined ) {
        // si no se proporciona ID, nosotros lo "creamos"
        if (tarea.id === undefined) {
          tarea.id = todos.at(-1).id + 1; // le sumo uno al último id
        }
        // correcto
        todos.push(req.body);
        res.status(201).json(tarea);
    } else {
        // error
        res.status(400).json(tarea);
    }
  });

// en la ruta le pasamos el parámetro ID de la tarea a borrar:
app.delete('/todos/:id', (req, res) => {
    const idTarea = parseInt(req.params.id);
    if (isNaN(idTarea)) {
        res.status(400).json({});
    } else {
        const tam = todos.length;
        todos = todos.filter(todo => todo.id !== idTarea);
        if (tam == todos.length) {
            res.status(404).json({});;
        } else {
            res.status(204).json({});;
        }
    }
  });

app.put('/todos/:id', (req, res) => {
  const todoId = parseInt(req.params.id);
  const tareaActualizada = req.body;
    if(tareaActualizada.task !== undefined && !isNaN(todoId) ) {
      todos = todos.map(todo => (todo.id === todoId ? tareaActualizada : todo));
      res.json(tareaActualizada);
    } else {
        // error
        res.status(400).json(tarea);
    }
  });

// los primeros 1024 puertos se pueden usar sólo por el sistema operativo (elevación)
app.listen(PORT, () => console.log(`Servidor en el puerto ${PORT}.`));
