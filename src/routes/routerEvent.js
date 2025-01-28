import express from "express";
import { verifikasi } from "../middleware/verifikasi.js";
import upload from "../../upload.js";
import {
  createEvent,
  deleteEvent,
  getEvent,
  getEventById,
  getPaginatedEvent,
  updateEvent,
} from "../controller/eventController.js";

const router = express.Router();

router.get("/showpaginated", getPaginatedEvent);
router.get("/show", getEvent);
router.get("/show/:id", getEventById);
router.post("/create", upload.single("photo"), createEvent);
router.put("/update/:id", upload.single("photo"), updateEvent);
router.delete("/delete", verifikasi, deleteEvent);

export default router;
