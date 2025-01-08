import express from "express";
import upload from "../../upload.js";
import {
  createSubCategory,
  deleteSubCategory,
  getSubCategory,
  getSubCategoryById,
  getSubCategoryByIdOutlet,
  getSubCategoryByNameCafe,
  updateSubCategory,
} from "../controller/subcategoryController.js";
import { verifikasi } from "../middleware/verifikasi.js";

const router = express.Router();

router.get("/showcafename/:outlet_name", getSubCategoryByNameCafe);
router.get("/showbyidoutlet/:id", getSubCategoryByIdOutlet);
router.get("/show", getSubCategory);
router.get("/show/:id", getSubCategoryById);
router.post("/create", upload.single("photo"), verifikasi, createSubCategory);
router.put(
  "/update/:id",
  upload.single("photo"),
  verifikasi,
  updateSubCategory
);
router.delete("/delete/:id", verifikasi, deleteSubCategory);

export default router;
