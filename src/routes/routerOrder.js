import express from "express";
import { verifikasi } from "../middleware/verifikasi.js";
import {
  createOrder,
  deleteOrder,
  getOrder,
  getOrderById,
  updateOrder,
} from "../controller/orderController.js";

const router = express.Router();

router.get("/show", getOrder);
router.get("/show/:id", getOrderById);
router.post("/create", createOrder);
router.put("/update/:id", updateOrder);
router.delete("/delete/:id", verifikasi, deleteOrder);

export default router;
