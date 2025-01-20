import express from "express";
import upload from "../../upload.js";
import {
  createSubCategory,
  deleteSubCategory,
  getPaginatedSubCategory,
  getSubCategory,
  getSubCategoryById,
  getSubCategoryByIdOutlet,
  getSubCategoryByIdSC,
  getSubCategoryByNameCafe,
  updateSubCategory,
} from "../controller/subcategoryController.js";
import { verifikasi } from "../middleware/verifikasi.js";

const router = express.Router();

router.get("/showcafename/:outlet_name", getSubCategoryByNameCafe);
router.get("/showbyidoutlet/:id", getSubCategoryByIdOutlet);
router.get("/show", getSubCategory);
router.get("/showpaginated", getPaginatedSubCategory);
router.get("/show/:id", getSubCategoryById);
router.get("/showbyid/:id", getSubCategoryByIdSC);
router.post("/create", verifikasi, createSubCategory);
router.put(
  "/update/:id",

  verifikasi,
  updateSubCategory
);
router.delete("/delete/:id", verifikasi, deleteSubCategory);

export default router;
