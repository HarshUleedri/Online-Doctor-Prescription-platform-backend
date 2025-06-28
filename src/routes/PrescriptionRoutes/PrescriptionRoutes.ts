import express, { Request, Response } from "express";
import { DoctorProtectedMiddleware } from "../../middleware/DoctorProtectedMiddleware";
import {
  createPrescription,
  downloadPrescription,
  generateAndSendPDF,
  getPrescriptionForDoctor,
  getPrescriptionForPatient,
  getSinglePrescription,
} from "../../controllers/PrescriptionControllers/PrescriptionControllers";

const router = express.Router();

router.get("/doctor", DoctorProtectedMiddleware, getPrescriptionForDoctor);
router.get("/patient", DoctorProtectedMiddleware, getPrescriptionForPatient);
router.get("/:id", getSinglePrescription);
router.get("/:id/download", downloadPrescription);
router.post("/", createPrescription);
router.post("/:id/generate-pdf", generateAndSendPDF);
router.post("/:id/send-email", generateAndSendPDF);

export default router;
