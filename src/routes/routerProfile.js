import express from "express";
import upload from "../../upload.js";
import {
  createProfile,
  deleteProfile,
  getProfile,
  updateProfile,
} from "../controller/profileController.js";
import { verifikasi } from "../middleware/verifikasi.js";

const router = express.Router();

router.get("/show", getProfile);
router.get("/show/:id", getProfile);
router.post("/create", upload.single("logo"), verifikasi, createProfile);
router.put("/update/:id", upload.single("logo"), verifikasi, updateProfile);
router.delete("/delete/:id", verifikasi, deleteProfile);

export default router;
