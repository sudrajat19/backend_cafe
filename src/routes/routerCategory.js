import express from "express";
import upload from "../../upload.js";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
  getCategoryById,
  getCategoryByIdOutlet,
  getCategoryByNameCafe,
  getPaginatedCategory,
  updateCategory,
} from "../controller/categoryController.js";
import { verifikasi } from "../middleware/verifikasi.js";

const router = express.Router();

router.get("/showpaginated", getPaginatedCategory);
router.get("/showC", getCategory);
router.get("/showall/:outlet_name/:best_seller", getAllCategories);
router.get("/showbyidoutlet/:id", getCategoryByIdOutlet);
router.get("/showcafename/:outlet_name", getCategoryByNameCafe);
router.get("/show/:id", getCategoryById);
router.post("/create", verifikasi, createCategory);
router.put("/update/:id", verifikasi, updateCategory);
router.delete("/delete/:id", verifikasi, deleteCategory);

export default router;
