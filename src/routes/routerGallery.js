import express from "express";
import upload from "../../upload.js";
import {
  createGallery,
  deleteGallery,
  getGalleryByCafeName,
  getGalleryById,
  getGalleryByIdOutlet,
  getPaginatedGallery,
  updateGallery,
} from "../controller/galleryController.js";
import { verifikasi } from "../middleware/verifikasi.js";

const router = express.Router();

router.get("/showbyidoutlet/:id", getGalleryByIdOutlet);
router.get("/showcafename/:outlet_name", getGalleryByCafeName);
router.get("/show/:id", getPaginatedGallery);
router.get("/show/:id", getGalleryById);
router.post("/create", upload.single("image"), verifikasi, createGallery);
router.put("/update/:id", upload.single("image"), verifikasi, updateGallery);
router.delete("/delete/:id", verifikasi, deleteGallery);

export default router;
