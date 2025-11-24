// utils/formatDate.js

// ---------------------------------------------------------------
// Función: formatDateFields
// Propósito: formatear los campos de un objeto que contienen fechas
// en formato 'YYYY-MM-DD', manejando distintos tipos de valores.
// ---------------------------------------------------------------
export const formatDateFields = (obj) => {
  // Object.entries(obj) convierte el objeto en un array de pares [clave, valor]
  // Object.fromEntries(...) reconstruye un objeto a partir de un array de pares
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {

      // 🔹 Caso 1: Firestore Timestamp (tiene método .toDate())
      // Convierte el timestamp a Date, luego a ISO y extrae solo la fecha
      if (value && typeof value.toDate === "function") {
        const date = value.toDate();
        return [key, date.toISOString().split("T")[0]];
      }

      // 🔹 Caso 2: Objeto Date nativo de JavaScript
      // Convierte directamente a ISO y extrae la fecha
      if (value instanceof Date) {
        return [key, value.toISOString().split("T")[0]];
      }

      // 🔹 Caso 3: String que representa una fecha válida
      // Se valida con Date.parse y luego se transforma a ISO
      if (typeof value === "string" && !isNaN(Date.parse(value))) {
        const date = new Date(value);
        return [key, date.toISOString().split("T")[0]];
      }

      // 🔹 Caso default: cualquier otro valor se devuelve sin cambios
      return [key, value];
    })
  );
};
