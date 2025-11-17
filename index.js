// ---------------------------------------------------------------
// Servidor Principal - Express + Firestore Web SDK
// ---------------------------------------------------------------

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();   // Carga variables desde .env

const app = express();
const PORT = process.env.PORT || 3000;

// Log inicial
console.log("=> PORT:", process.env.PORT);
console.log("=> NODE_ENV:", process.env.NODE_ENV);

// ---------------------------------------------------------------
// Middlewares globales
// ---------------------------------------------------------------
app.use(cors());
app.use(express.json());

// Logging de cada request
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log("\n========= NUEVA PETICIÓN =========");
  console.log("=> Fecha:", timestamp);
  console.log("=> Método:", req.method);
  console.log("=> URL original:", req.originalUrl);
  console.log("=> content-type:", req.headers['content-type'] || 'No especificado');
  console.log("==================================\n");
  next();
});

// ---------------------------------------------------------------
// Ruta base
// ---------------------------------------------------------------
app.get('/', (req, res) => {
  res.json({
    mensaje: 'API REST funcionando correctamente en /'
  });
});

// ---------------------------------------------------------------
// Routers
// ---------------------------------------------------------------
import puntosRouter from './src/routers/puntos.router.js';
import vallasRouter from './src/routers/vallas.router.js';
import operativosRouter from './src/routers/operativos.router.js';
import movimientosRouter from './src/routers/movimientos.router.js';
import camionesRouter from './src/routers/camiones.router.js';
import empleadosRouter from './src/routers/empleados.router.js';

app.use('/api/puntos', puntosRouter);
app.use('/api/vallas', vallasRouter);
app.use('/api/operativos', operativosRouter);
app.use('/api/movimientos', movimientosRouter);
app.use('/api/camiones', camionesRouter);
app.use('/api/empleados', empleadosRouter);

// ---------------------------------------------------------------
// 404
// ---------------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta NO encontrada',
    ruta: req.originalUrl
  });
});

// ---------------------------------------------------------------
// Manejo global de errores
// ---------------------------------------------------------------
app.use((err, req, res, next) => {
  console.log("=> Error en middleware global");
  console.log("=> Mensaje:", err.message);

  const respuesta = {
    error: 'Error interno del servidor',
    mensaje: err.message
  };

  if (process.env.NODE_ENV !== 'production') {
    respuesta.stack = err.stack;
  }

  res.status(500).json(respuesta);
});

// ---------------------------------------------------------------
// Inicializar servidor
// ---------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`Servidor escuchando en: http://localhost:${PORT}`);
});
