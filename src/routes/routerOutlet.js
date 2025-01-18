import express from "express";
import {
  createOutlet,
  deleteOutletById,
  getAll,
  getAllByIdOutlet,
  getOutletAll,
  getOutletAllById,
  getPaginatedOutlet,
  updateOutlet,
} from "../controller/outletController.js";
import { verifikasi } from "../middleware/verifikasi.js";
import {
  createEmailValidator,
  createOutletValidator,
  updateEmailValidator,
  updateOutletValidator,
} from "../validations/outletValidations.js";

const router = express.Router();

router.get("/showalltable/:outlet_name", getAll);
router.get("/showpaginated", getPaginatedOutlet);
router.get("/show", getOutletAll);
router.get("/show/:id", getOutletAllById);
router.get("/showall", getAllByIdOutlet);
router.post(
  "/create",
  createEmailValidator,
  createOutletValidator,
  createOutlet
);
router.put(
  "/update/:id",
  verifikasi,
  updateEmailValidator,
  updateOutletValidator,
  updateOutlet
);
router.delete("/delete/:id", verifikasi, deleteOutletById);

export default router;
