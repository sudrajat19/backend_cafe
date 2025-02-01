import express from "express";
import {
  createTransaction,
  deleteTransaction,
  getPaginatedTransaction,
  getTransaction,
  getTransactionById,
  updateTransaction,
} from "../controller/transactionController.js";
import { verifikasi } from "../middleware/verifikasi.js";

const router = express.Router();

router.get("/show", getTransaction);
router.get("/showpaginated", getPaginatedTransaction);
router.get("/show/:id", getTransactionById);
router.post("/create", verifikasi, createTransaction);
router.put("/update/:id", verifikasi, updateTransaction);
router.delete("/delete/:id", verifikasi, deleteTransaction);

export default router;
