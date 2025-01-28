import express from "express";
import { verifikasi } from "../middleware/verifikasi.js";
import {
  createGallery,
  deleteGallery,
  getGallery,
  getGalleryById,
  getPaginatedGallery,
  updateGallery,
} from "../controller/galleryController.js";
import upload from "../../upload.js";

const router = express.Router();

router.get("/showpaginated", getPaginatedGallery);
router.get("/show", getGallery);
router.get("/show/:id", getGalleryById);
router.post("/create", verifikasi, upload.single("image"), createGallery);
router.put("/update/:id", verifikasi, upload.single("image"), updateGallery);
router.delete("/delete", verifikasi, deleteGallery);

export default router;
