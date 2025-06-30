import express from "express";
import { DoctorProtectedMiddleware } from "../../middleware/DoctorProtectedMiddleware";
import upload from "../../middleware/ProfileImageMiddleware";
import { DoctorImageUpload } from "../../controllers/profileImageUploadController/DoctorImageUpload";
import { PatientImageUpload } from "../../controllers/profileImageUploadController/PatientImageUpload";

const router = express.Router();

router.post("/doctor-image", upload.single("image"), DoctorImageUpload);
router.post("/patient-image", upload.single("image"), PatientImageUpload);

export default router;
