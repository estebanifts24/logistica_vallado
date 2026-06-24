// src/middlewares/multer.js
import multer from "multer";        // Librería para manejar subida de archivos (multipart/form-data)
import path from "path";            // Módulo nativo de Node.js para manejar rutas de archivos
import { fileURLToPath } from "url"; // Necesario en ES Modules para obtener __dirname

// ---------------------------------------------------------------
// Obtener la ruta del archivo actual y la carpeta del proyecto
// ---------------------------------------------------------------
const __filename = fileURLToPath(import.meta.url); // Ruta completa del archivo actual (src/middlewares/multer.js)
const __dirname = path.dirname(__filename);       // Carpeta donde está este archivo (src/middlewares)



// ---------------------------------------------------------------
// Middleware de almacenamiento de Multer
// ---------------------------------------------------------------
const storage = multer.diskStorage({
  // -------------------------------------------------------------
  // Carpeta donde se guardarán los archivos
  // -------------------------------------------------------------
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads"); // Carpeta src/uploads
    // Logging solo en desarrollo
    if (process.env.NODE_ENV === "development") {
      console.log("Archivo se guardará en:", uploadPath);
    }
    cb(null, uploadPath); // Le dice a Multer dónde guardar el archivo
  },

  // -------------------------------------------------------------
  // Nombre único legible del archivo
  // -------------------------------------------------------------
 filename: (req, file, cb) => {
  const codigo = req.body.codigo?.trim().toUpperCase();

  if (!codigo) {
    return cb(new Error("Código no recibido"));
  }

  const ext = path.extname(file.originalname).toLowerCase();

  const finalName = `${codigo}${ext}`;

  if (process.env.NODE_ENV === "development") {
    console.log("Nombre del archivo guardado:", finalName);
  }

  cb(null, finalName);
},
});

// ---------------------------------------------------------------
// Filtro de archivos permitidos
// ---------------------------------------------------------------
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;                      // Tipos de archivos permitidos
  const mimetype = allowedTypes.test(file.mimetype.toLowerCase()); // Valida MIME type
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase()); // Valida extensión

  if (mimetype && extname) { // Si pasa ambas validaciones
    if (process.env.NODE_ENV === "development") console.log("Archivo aceptado:", file.originalname);
    cb(null, true);          // Permite subir el archivo
  } else {
    if (process.env.NODE_ENV === "development") console.log("Archivo rechazado:", file.originalname);
    cb(new Error("Solo se permiten imágenes JPEG o PNG")); // Rechaza el archivo
  }
};

// ---------------------------------------------------------------
// Exportar la instancia de multer lista para usar en routers
// ---------------------------------------------------------------
const upload = multer({ storage, fileFilter }); // Combina almacenamiento + filtro
export default upload;                           // Lo importas en cualquier router para usarlo
