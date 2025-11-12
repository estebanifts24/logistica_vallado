// Importamos módulos para manejar archivos y rutas
import fs from "fs";
import path from "path";

// __dirname para saber dónde estamos ubicados
const __dirname = import.meta.dirname;

// Definimos la ruta del archivo JSON que simula la base de datos
const pathArchivo = path.join(__dirname, "./vallas.json");

// Leemos el contenido del archivo JSON
const json = fs.readFileSync(pathArchivo, "utf-8");

// Convertimos el contenido en un array de objetos
const vallas = JSON.parse(json);

// Mostramos en consola para verificar
console.log(vallas);

//////////////////////////////////////////////////////////////
/// FUNCIÓN: Obtener todas las vallas
//////////////////////////////////////////////////////////////

export const getAllVallas = () => vallas;

//////////////////////////////////////////////////////////////
/// FUNCIÓN: Buscar valla por ID
//////////////////////////////////////////////////////////////

export const getVallaById = (id) => vallas.find((v) => v.id == id);

//////////////////////////////////////////////////////////////
/// FUNCIÓN: Crear una nueva valla
//////////////////////////////////////////////////////////////

export const createValla = (data) => {
  const nuevaValla = {
    id: vallas.length + 1, // Genera un ID automáticamente
    ...data                // Copia los datos recibidos
  };

  vallas.push(nuevaValla); // Agrega la nueva valla al array

  // Guarda los cambios en el archivo JSON
  fs.writeFileSync(pathArchivo, JSON.stringify(vallas, null, 2), "utf-8");

  return nuevaValla;
};

//////////////////////////////////////////////////////////////
/// FUNCIÓN: Eliminar una valla
//////////////////////////////////////////////////////////////

export const deleteValla = (id) => {
  const index = vallas.findIndex((v) => v.id == id);

  if (index === -1) return null; // No encontrada

  const eliminada = vallas.splice(index, 1)[0]; // La borramos
  fs.writeFileSync(pathArchivo, JSON.stringify(vallas, null, 2), "utf-8");
  return eliminada;
};

//////////////////////////////////////////////////////////////
/// FUNCIÓN: Actualizar una valla existente
//////////////////////////////////////////////////////////////

export const updateValla = (id, data) => {
  const index = vallas.findIndex((v) => v.id == id);
  if (index === -1) return null;

  // Creamos un nuevo objeto actualizado
  const actualizada = { id, ...data };

  // Reemplazamos el objeto viejo con el nuevo
  vallas[index] = actualizada;

  // Guardamos los cambios en el archivo JSON
  fs.writeFileSync(pathArchivo, JSON.stringify(vallas, null, 2), "utf-8");

  return actualizada;
};
