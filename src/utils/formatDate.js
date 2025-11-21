// utils/formatDate.js

export const formatDateFields = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {

      // Caso 1: Timestamp de Firestore (tiene método .toDate())
      if (value && typeof value.toDate === "function") {
        const date = value.toDate();
        return [key, date.toISOString().split("T")[0]];
      }

      // Caso 2: Objeto Date normal
      if (value instanceof Date) {
        return [key, value.toISOString().split("T")[0]];
      }

      // Caso 3: String que representa una fecha válida
      if (typeof value === "string" && !isNaN(Date.parse(value))) {
        const date = new Date(value);
        return [key, date.toISOString().split("T")[0]];
      }

      // Caso default: devolver el valor sin tocarlo
      return [key, value];
    })
  );
};
