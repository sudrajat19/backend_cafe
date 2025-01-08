import express from "express";
import upload from "../../upload.js";
import {
  createMenu,
  deleteMenu,
  getMenuBestSeller,
  getMenuByCafeName,
  getMenuById,
  getMenuByIdOutlet,
  getPaginatedMenu,
  updateMenu,
} from "../controller/menuController.js";
import { verifikasi } from "../middleware/verifikasi.js";

const router = express.Router();

router.get("/showbestseller/:best_seller", getMenuBestSeller);
router.get("/showbyidoutlet/:id", getMenuByIdOutlet);
router.get("/showcafename/:outlet_name", getMenuByCafeName);
router.get("/show", getPaginatedMenu);
router.get("/show/:id", getMenuById);
router.post("/create", upload.single("photo"), verifikasi, createMenu);
router.put("/update/:id", upload.single("photo"), verifikasi, updateMenu);
router.delete("/delete/:id", verifikasi, deleteMenu);

export default router;
