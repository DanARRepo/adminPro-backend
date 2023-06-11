require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./DB/config');

// Crear el servidor de express
const app = express();

// Configurar CORS
app.use( cors() );

// Lectura y parseo del body
app.use( express.json() );

// Base de datos
dbConnection();

// Rutas
app.use( '/api/users', require('./routes/users.routes') );
app.use( '/api/login', require('./routes/auth.routes') );


// mean_user
// erlEnRbGrfzT1FM8

app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
})