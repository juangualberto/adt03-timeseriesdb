# Introducción a NodeJS

## Instalación de NodeJS

Desde que **node** es a su vez un paquete instalable con el gestor de paquetes de **npm**, lo podemos instalar globalmente así:

**en Debian/Ubuntu/Mint**:

```bash
sudo npm install -g n
sudo n 20
```

**en Windows 10/11** (con elevación):

```powershell
PS> winget install openjs.nodejs.lts
```

## Modo interactivo



## Backend de ejemplo

Uno de los puntos fuertes de Node.JS es su capacidad para actuar como servidor o backend de alpicaciones, pues en apenas unas pocas líneas podremos implementar un servicio. A continuación vamos a ver como hacer un servidor de ejemplo en poco más de 50 líneas de código.

1. **Configuración del servidor (Node.js con Express):**

En el directorio raíz de nuestro proyecto, nos vamos a la carpeta **node**, que ya tenía la dependencia del cliente InfluxDB (mira el fichero package.json) y ejecuta los siguientes comandos en la terminal:

```bash
cd node
npm install express 
```

Luego, creamos un archivo llamado `server.js`:

```javascript 
const express = require('express');
const app = express();

// enrutador
app.get('/', (req, res) => {
  res.send('Has hecho una petición GET.');
});

app.post('/', (req, res) => {
    res.send('Has hecho una petición POST.');
  });

app.delete('/', (req, res) => {
    res.send('Has hecho una petición DELETE.');
  });

app.put('/', (req, res) => {
    res.send('Has hecho una petición PUT.');
  });

// los primeros 1024 puertos se pueden usar sólo por el sistema operativo (elevación)
app.listen(8000, () => console.log('Example app is listening on port 8000.'));
```

Para lanzar el servidor, desde la carpeta *node* escribimos:

```bash
node server.js
```

Ahora podemos con Postman o la extensión de Firefox REST client hacer las peticiones para probar que funciona. También se puede hacer con CURL:

```bash
curl -X GET    -i http://localhost:8000
curl -X POST   -i http://localhost:8000
curl -X PUT    -i http://localhost:8000
curl -X DELETE -i http://localhost:8000
```

Ten cuidado si pruebas con cURL de usar en tus POST/PUT/PATCH el parámetro `-H 'Content-Type: application/json'` y `-H 'Accept: application/json'` para añadir en las cabeceras de la petición que estamos mandando o esperamos los datos en formato JSON. Ejemplo:

```bash
curl -X GET -H 'Accept: application/json' -i http://localhost:8000
curl -X POST -H 'Content-Type: application/json' -i http://localhost:8000/todos --data '{"id": 10, "task":"Estudiar para el examen de NodeJS"}'
curl -X PUT -H 'Content-Type: application/json' -i http://localhost:8000/todos/10 --data '{"id": 10, "task":"Estudiar para el examen de Acceso a Datos"}'
curl -X DELETE -i http://localhost:8000/10
```

Vamos a crear una aplicación (API REST) que consume una lista de tareas:

```javascript
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 8000;

app.use(bodyParser.json());

let todos = [
  { id: 1, task: 'Nos vamos de excursión a Oracle' },
  { id: 2, task: 'Nos volvemos muy aburridos de Oracle' },
];

// GET - Obtener todas las tareas
app.get('/todos', (req, res) => {
  res.json(todos);
});

// POST - Agregar una nueva tarea
app.post('/todos', (req, res) => {
  const newTodo = req.body;
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PUT - Actualizar una tarea existente
app.put('/todos/:id', (req, res) => {
  const todoId = parseInt(req.params.id);
  const updatedTodo = req.body;
  todos = todos.map(todo => (todo.id === todoId ? updatedTodo : todo));
  res.json(updatedTodo);
});

// DELETE - Eliminar una tarea
app.delete('/todos/:id', (req, res) => {
  const todoId = parseInt(req.params.id);
  todos = todos.filter(todo => todo.id !== todoId);
  res.sendStatus(204);
});

app.listen(PORT, () => {
  console.log(`El servidor está corriendo en http://localhost:${PORT}`);
});
```

Fíjate cómo hemos leído el parámetro **id** en el *DELETE* de la tarea:

```javascript
app.delete('/todos/:id', (req, res) => {
  const todoId = parseInt(req.params.id);
  todos = todos.filter(todo => todo.id !== todoId);
  res.sendStatus(204);
});
```

### Paso de parámetros:

Al tratarse de una API REST el parámetro va directamente en la ruta sin más, así si queremos hacer un borrado de la tarea 2 hacemos una petición DELETE a la URL: http://localhost:8000/todos/2. Sin embargo, estamos acostumbrados a ver en la URL del navegador algo como: http://localhost:8000/deleteTodo?id=2, en este caso no sería una API REST y entonces los parámetros van asignados con el símbolo '='. Veamos otro ejemplo con dos parámetros para enterderlo:

Tipo | Verbo URL Explicación
-----|----------------------
REST | PATCH http://localhost:8000/todos/2/task/no%20hacer%20nada | Actualizar la tarea 2 a "no hacer nada"
normal | POST | http://localhost:8000/parcheaTodo?id=2&task=no%20hacer%20nada Actualizar la tarea 2 a "no hacer nada"

## Frontend

Vamos a dar un paso más, vamos a crear ahora una Web, para ello añadimos una dependencia más:

```bash
npm install --save body-parser
```

1. **Cliente HTML5 y JavaScript:**

Preparamos el servidor para que podamos servir contenido estático. Para ello creamos una carpeta **public** donde va a estar el contenido estático y añadimos esta lína al enrutador (antes del primer ***app.get***):

```javascript
// permitimos servir contenido estático (carpeta public)
app.use('/', express.static('public'));
```

Creamos un archivo llamado `index.html`:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Programador de tareas</title>
</head>
<body>

<h1>TO-DO App</h1>

<!-- Formulario para agregar una nueva tarea -->
<form id="addTodoForm">
  <label for="task">Nueva tarea:</label>
  <input type="text" id="task" required>
  <button type="submit">Agregar tarea</button>
</form>

<!-- Lista de tareas -->
<ul id="todoList"></ul>

<script>
  // Cliente JavaScript para interactuar con la API REST

  const apiUrl = 'http://localhost:8000/todos';
  const todoList = document.getElementById('todoList');
  const addTodoForm = document.getElementById('addTodoForm');

  // Función para cargar las tareas
  async function fetchTodos() {
    const response = await fetch(apiUrl);
    const todos = await response.json();
    displayTodos(todos);
  }

  // Función para mostrar las tareas en el cliente
  function displayTodos(todos) {
    todoList.innerHTML = '';
    todos.forEach(todo => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `${todo.task} 
        <button onclick="updateTodo(${todo.id})">Actualizar</button>
        <button onclick="deleteTodo(${todo.id})">Eliminar</button>`;
      todoList.appendChild(listItem);
    });
  }

  // Función para agregar una nueva tarea
  async function addTodo(event) {
    event.preventDefault();
    const taskInput = document.getElementById('task');
    const task = taskInput.value;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ task }),
    });

    if (response.ok) {
      fetchTodos();
      taskInput.value = '';
    }
  }

  // Función para actualizar una tarea
  async function updateTodo(id) {
    const response = await fetch(`${apiUrl}/${id}`);
    const todo = await response.json();
    const updatedTask = prompt('Actualizar tarea:', todo.task);

    if (updatedTask !== null) {
      await fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task: updatedTask }),
      });

      fetchTodos();
    }
  }

  // Función para eliminar una tarea
  async function deleteTodo(id) {
    const confirmDelete = confirm('¿Seguro que quieres eliminar esta tarea?');

    if (confirmDelete) {
      await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
      fetchTodos();
    }
  }

  // Event Listener para el formulario de agregar tarea
  addTodoForm.addEventListener('submit', addTodo);

  // Cargar las tareas al cargar la página
  fetchTodos();
</script>

</body>
</html>
```

\pagebreak

