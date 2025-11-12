// Importamos las dependencias necesarias
import express from 'express'; // Framework para crear el servidor
import cors from 'cors';       // Permite solicitudes desde otros dominios (CORS)

// Creamos la aplicación de Express
const app = express(); 

//////////////////////////////////////////////////////////////
/// MIDDLEWARES DE EXPRESS
//////////////////////////////////////////////////////////////

// Middleware para permitir solicitudes entre distintos dominios
app.use(cors());

// Middleware para procesar los datos JSON que vienen en el body de las solicitudes
// Ejemplo: si mandamos un POST con un objeto JSON, esto lo convierte en req.body automáticamente
app.use(express.json());

//////////////////////////////////////////////////////////////
/// IMPORTAR RUTAS
//////////////////////////////////////////////////////////////

// Importamos las rutas relacionadas con las vallas
import vallasRouter from './src/routes/vallas.router.js';

// Registramos las rutas dentro de la aplicación, con el prefijo /api
// Ejemplo: GET http://localhost:3000/api/vallas
app.use('/api', vallasRouter);

//////////////////////////////////////////////////////////////
/// RUTA RAÍZ (GET /)
//////////////////////////////////////////////////////////////

// Ruta base de bienvenida
app.get('/', (req, res) => {
  res.json({ mensaje: '¡API de Logística de Vallado en funcionamiento!' });
});

//////////////////////////////////////////////////////////////
/// MIDDLEWARE DE ERROR 404
//////////////////////////////////////////////////////////////

// Este middleware se ejecuta si ninguna ruta coincide
// Sirve para manejar errores de rutas inexistentes
app.use((req, res, next) => {
  res.status(404).json({ error: 'Ruta no encontrada (404)' });
});

//////////////////////////////////////////////////////////////
/// INICIO DEL SERVIDOR
//////////////////////////////////////////////////////////////

// Definimos el puerto
const PORT = 3000;

// Iniciamos el servidor y mostramos un mensaje en consola
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
