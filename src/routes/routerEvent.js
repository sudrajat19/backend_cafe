import express from "express";
import upload from "../../upload.js";
import {
  createEvent,
  deleteEvent,
  getEvent,
  getEventById,
  updateEvent,
} from "../controller/eventController.js";
import { verifikasi } from "../middleware/verifikasi.js";

const router = express.Router();

router.get("/show", getEvent);
router.get("/show/:id", getEventById);
router.post("/create", upload.single("photo"), verifikasi, createEvent);
router.put("/update/:id", upload.single("photo"), verifikasi, updateEvent);
router.delete("/delete/:id", verifikasi, deleteEvent);

export default router;
