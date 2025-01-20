import express from "express";
import upload from "../../upload.js";
import {
  createProfile,
  deleteProfile,
  getOutletProfile,
  getPaginatedProfile,
  getPaginatedProfiles,
  getProfile,
  getProfileByCafeName,
  getProfileById,
  getProfileByIdOutlet,
  updateProfile,
  updateProfileOutlet,
} from "../controller/profileController.js";
import { verifikasi } from "../middleware/verifikasi.js";
import {
  updateEmailValidator,
  updateOutletValidator,
} from "../validations/outletValidations.js";
import { validationsPassword } from "../validations/passwordValidations.js";

const router = express.Router();

router.get("/showall", getPaginatedProfiles);
router.get("/showpaginated", getPaginatedProfile);
router.get("/showprofileandoutlet/:id", getOutletProfile);
router.get("/showbyidoutlet/:id", getProfileByIdOutlet);
router.get("/showcafename/:outlet_name", getProfileByCafeName);
router.get("/show", getProfile);
router.get("/show/:id", getProfileById);
router.post("/create", upload.single("logo"), verifikasi, createProfile);
router.put("/update/:id", upload.single("logo"), verifikasi, updateProfile);
router.put(
  "/updateprofileoutlet/:id_outlet",
  upload.single("logo"),
  verifikasi,
  validationsPassword,
  updateEmailValidator,
  updateOutletValidator,
  updateProfileOutlet
);
router.delete("/delete/:id", verifikasi, deleteProfile);

export default router;
