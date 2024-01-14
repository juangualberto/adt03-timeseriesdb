# Protegiendo el servicio

A continuación vamos a ver cómo crear un sistema de inicio de sesión con Node.js, Express, Pug y Mysql.

Para crear un sistema de inicio de sesión con Node.js, Express, Pug y almacenamiento de datos de usuario y contraseñas en MySQL, sigue estos pasos:

## 1. Configuración del Proyecto

1. Crea un nuevo directorio para tu proyecto.
2. Inicializa un nuevo proyecto de Node.js ejecutando `npm init -y` en la terminal.
3. Instala las dependencias necesarias:

```bash
npm install express pug mysql2 express-session body-parser
```

## 2. Configuración de MySQL

Asegúrate de tener un servidor MySQL en ejecución y crea una base de datos junto con una tabla para almacenar los datos del usuario. Aquí hay un ejemplo simple:

```sql
CREATE DATABASE IF NOT EXISTS mydatabase;
USE mydatabase;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);
```

## 3. Configuración del Servidor Express

Crea un archivo llamado `app.js` para tu servidor Express:

```javascript
const express = require('express');
const session = require('express-session');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 8000;

// Configuración de MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  port: 33306,
  user: 'root',
  password: '238fmvmM',
  database: 'reservas',
});

// Conexión a MySQL
connection.connect(err => {
  if (err) {
    console.error('Error al conectar a MySQL:', err);
    return;
  }
  console.log('Conectado a MySQL');
});

// Configuración de sesiones
app.use(
  session({
    secret: 'your-secret-key', // se puede generar con bcrypt
    resave: false,
    saveUninitialized: true,
  })
);

// Configuración de Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware para analizar el cuerpo de las solicitudes
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas
app.get('/', (req, res) => {
  res.render('index', { user: req.session.user });
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Verificación de credenciales en MySQL
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  connection.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('Error al verificar las credenciales:', err);
      res.redirect('/login');
    } else {
      if (results.length > 0) {
        req.session.user = username;
        res.redirect('/');
      } else {
        res.redirect('/login');
      }
    }
  });
});

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error(err);
    } else {
      res.redirect('/login');
    }
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
```

## 4. Crear las Vistas Pug

Crea un directorio llamado `views` en el directorio raíz de tu proyecto. Dentro de este directorio, crea dos archivos Pug: `index.pug` y `login.pug`.

### Contenido de `views/index.pug`

Este archivo contiene la vista principal:

```pug

doctype html
html(lang="en")
  head
    meta(charset="UTF-8")
    meta(name="viewport", content="width=device-width, initial-scale=1.0")
    title Sistema de Login
  body
    h1 Bienvenido, #{user || 'Invitado'}
    if user
      p
        a(href='/logout') Cerrar Sesión
    else
      p
        a(href='/login') Iniciar Sesión
```

### Contenido de `views/login.pug`

Formulario de login:

```pug

doctype html
html(lang="en")
  head
    meta(charset="UTF-8")
    meta(name="viewport", content="width=device-width, initial-scale=1.0")
    title Iniciar Sesión
  body
    h1 Iniciar Sesión
    form(action='/login', method='post')
      label(for='username') Usuario:
      input(type='text', id='username', name='username', required)
      br
      label(for='password') Contraseña:
      input(type='password', id='password', name='password', required)
      br
      button(type='submit') Iniciar Sesión
```

## 5. Ejecución del Proyecto

1. Asegúrate de tener un servidor MySQL en ejecución.
2. Ejecuta `node app.js` para iniciar el servidor Express.
3. Accede a tu aplicación en [http://localhost:8000](http://localhost:8000).

Este ejemplo básico utiliza una conexión a MySQL para verificar las credenciales durante el inicio de sesión. Asegúrate de modificar las configuraciones de MySQL (`tu_usuario_mysql`, `tu_contraseña_mysql`) según tu entorno. Además, en un entorno de producción, deberías manejar las contraseñas de manera más segura y considerar la seguridad en todas las capas de tu aplicación.

\pagebreak
