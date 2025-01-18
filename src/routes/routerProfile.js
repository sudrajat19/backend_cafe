import express from "express";
import upload from "../../upload.js";
import {
  createProfile,
  deleteProfile,
  getPaginatedProfile,
  getProfile,
  getProfileByCafeName,
  getProfileById,
  getProfileByIdOutlet,
  updateProfile,
} from "../controller/profileController.js";
import { verifikasi } from "../middleware/verifikasi.js";

const router = express.Router();

router.get("/showpaginated", getPaginatedProfile);
router.get("/showbyidoutlet/:id", getProfileByIdOutlet);
router.get("/showcafename/:outlet_name", getProfileByCafeName);
router.get("/show", getProfile);
router.get("/show/:id", getProfileById);
router.post("/create", upload.single("logo"), verifikasi, createProfile);
router.put("/update/:id", upload.single("logo"), verifikasi, updateProfile);
router.delete("/delete/:id", verifikasi, deleteProfile);

export default router;
