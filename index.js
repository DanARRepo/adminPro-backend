require('dotenv').config();
const path = require('path');

const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./DB/config');

// Crear el servidor de express
const app = express();

// Configurar CORS
app.use( cors() );

// Carpeta public 
app.use( express.static('public') );

// Lectura y parseo del body
app.use( express.json() );

// Base de datos
dbConnection();

// Rutas
app.use( '/api/all', require('./routes/search.routes') );
app.use( '/api/login', require('./routes/auth.routes') );
app.use( '/api/users', require('./routes/users.routes') );
app.use( '/api/doctors', require('./routes/doctors.routes') );
app.use( '/api/hospitals', require('./routes/hostpitals.routes') );
app.use( '/api/uploads', require('./routes/uploads.routes') );

// Last
app.get('*', (req, res) => {
    res.sendFile(path.resolve( __dirname, 'public/index.html'));
});

// mean_user
// erlEnRbGrfzT1FM8

app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
})