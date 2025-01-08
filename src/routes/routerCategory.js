import express from "express";
import upload from "../../upload.js";
import {
  createCategory,
  deleteCategory,
  getCategory,
  getCategoryById,
  getCategoryByIdOutlet,
  getCategoryByNameCafe,
  updateCategory,
} from "../controller/categoryController.js";
import { verifikasi } from "../middleware/verifikasi.js";

const router = express.Router();

router.get("/show", getCategory);
router.get("/showbyidoutlet/:id", getCategoryByIdOutlet);
router.get("/showcafename/:outlet_name", getCategoryByNameCafe);
router.get("/show/:id", getCategoryById);
router.post("/create", upload.single("photo"), verifikasi, createCategory);
router.put("/update/:id", upload.single("photo"), verifikasi, updateCategory);
router.delete("/delete/:id", verifikasi, deleteCategory);

export default router;
