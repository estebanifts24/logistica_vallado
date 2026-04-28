import { Router } from "express";
import {
  listarStock,
  obtenerStock,
  crearStock,
  actualizarStock
} from "../controllers/stock.controller.js";

const router = Router();

router.get("/", listarStock);
router.get("/:id", obtenerStock);
router.post("/", crearStock);
router.put("/:id", actualizarStock);

export default router;