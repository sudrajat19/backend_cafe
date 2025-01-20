import express from "express";
import upload from "../../upload.js";
import {
  createContact,
  deleteContact,
  getContact,
  getContactById,
  getContactByIdOutlet,
  getContactByNameCafe,
  getPaginatedContact,
  updateContact,
} from "../controller/contactController.js";
import { verifikasi } from "../middleware/verifikasi.js";

const router = express.Router();

router.get("/showbyidoutlet/:id", getContactByIdOutlet);
router.get("/showcafename/:outlet_name", getContactByNameCafe);
router.get("/showpaginated", getPaginatedContact);
router.get("/show", getContact);
router.get("/show/:id", getContactById);
router.post("/create", upload.single("logo"), verifikasi, createContact);
router.put("/update/:id", upload.single("logo"), verifikasi, updateContact);
router.delete("/delete/:id", verifikasi, deleteContact);

export default router;
