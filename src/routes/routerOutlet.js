import express from "express";
import {
  createOutlet,
  deleteOutletById,
  getAllByIdOutlet,
  getOutletAll,
  getOutletAllById,
  updateOutlet,
} from "../controller/outletController.js";
import { verifikasi } from "../middleware/verifikasi.js";

const router = express.Router();

router.get("/show", getOutletAll);
router.get("/show/:id", getOutletAllById);
router.get("/showall", getAllByIdOutlet);
router.post("/create", createOutlet);
router.put("/update/:id", verifikasi, updateOutlet);
router.delete("/delete/:id", verifikasi, deleteOutletById);

export default router;
