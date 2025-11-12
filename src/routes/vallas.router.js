// Importamos Router desde Express (permite agrupar rutas)
import { Router } from "express";

// Creamos una instancia de Router
const router = Router();

//////////////////////////////////////////////////////////////
/// IMPORTAMOS LOS CONTROLADORES
//////////////////////////////////////////////////////////////

import {
  getAllVallas,
  searchValla,
  getVallaById,
  createValla,
  updateValla,
  deleteValla
} from "../controllers/vallas.controller.js";

//////////////////////////////////////////////////////////////
/// DEFINICIÓN DE RUTAS
//////////////////////////////////////////////////////////////

// Obtener todas las vallas
router.get('/vallas', getAllVallas);

// Buscar vallas por ubicación (query param ?ubicacion=)
router.get('/vallas/search', searchValla); 

// Obtener una valla específica por su ID
router.get('/vallas/:id', getVallaById);  



// Crear una nueva valla
router.post('/vallas', createValla);

// Actualizar una valla existente
router.put('/vallas/:id', updateValla);

// Eliminar una valla por ID
router.delete('/vallas/:id', deleteValla);

//////////////////////////////////////////////////////////////
/// EXPORTAMOS EL ROUTER
//////////////////////////////////////////////////////////////

export default router;
