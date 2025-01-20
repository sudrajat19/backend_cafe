import express from "express";
import upload from "../../upload.js";
import {
  createMenu,
  deleteMenu,
  getAllMenu,
  getMenuBestSeller,
  getMenuByCafeName,
  getMenuById,
  getMenuByIdM,
  getMenuByIdOutlet,
  getPaginatedMenu,
  getPaginatedMenus,
  updateMenu,
} from "../controller/menuController.js";
import { verifikasi } from "../middleware/verifikasi.js";

const router = express.Router();

router.get("/showbestseller/:best_seller", getMenuBestSeller);
router.get("/showbyidoutlet/:id", getMenuByIdOutlet);
router.get("/showcafename/:outlet_name", getMenuByCafeName);
router.get("/showall/:outlet_name", getAllMenu);
router.get("/showpaginated", getPaginatedMenus);
router.get("/show", getPaginatedMenu);
router.get("/show/:id", getMenuById);
router.get("/showbyid/:id", getMenuByIdM);
router.post("/create", upload.single("photo"), verifikasi, createMenu);
router.put("/update/:id", upload.single("photo"), verifikasi, updateMenu);
router.delete("/delete/:id", verifikasi, deleteMenu);

export default router;
