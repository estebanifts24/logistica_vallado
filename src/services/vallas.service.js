// Por ahora simplemente reexportamos funciones del modelo
// En el futuro voy a aplicar validaciones 

import * as model from '../models/vallas.model.js';

export const getAllVallas = () => model.getAllVallas();
export const getVallaById = (id) => model.getVallaById(id);
