import express, { Request, Response } from "express";
import { DoctorProtectedMiddleware } from "../../middleware/DoctorProtectedMiddleware";
import {
  createPrescription,
  downloadPrescription,
  generatePdfUrl,
  getPrescriptionForDoctor,
  getPrescriptionForPatient,
  getSinglePrescription,
} from "../../controllers/PrescriptionControllers/PrescriptionControllers";
import { PatientProtectedMiddleware } from "../../middleware/PatientProtectedMiddleware";

const router = express.Router();

router.get("/doctor", DoctorProtectedMiddleware, getPrescriptionForDoctor);
router.get("/patient", PatientProtectedMiddleware, getPrescriptionForPatient);
router.get("/:id", getSinglePrescription);
router.get("/:id/download", downloadPrescription);
router.post("/create", DoctorProtectedMiddleware, createPrescription);
router.post("/generate-pdf", generatePdfUrl);
// router.post("/:id/send-email", generateAndSendPDF);

export default router;
