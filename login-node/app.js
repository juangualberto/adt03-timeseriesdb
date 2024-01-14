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
  password: 's83n38DGB8d72',
  database: 'gestion',
});

// Conexión a MySQL
connection.connect(err => {
  if (err) {
    console.error('Error al conectar a MySQL:', err);
    return;
  }
  console.log('Conexión exitosa a MySQL');
});

// Configuración de sesiones
app.use(
  session({
    secret: 'your-secret-key', // Cambiar a una clave segura en producción
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
