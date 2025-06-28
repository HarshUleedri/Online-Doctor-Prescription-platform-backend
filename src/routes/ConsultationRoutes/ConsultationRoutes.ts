import express, { Request, Response } from "express";
import {
  createConsultation,
  getConsultationForDoctor,
  getConsultationForPatient,
  getSingleConsultationForDoctor,
} from "../../controllers/consultationController/consultationController";
import { DoctorProtectedMiddleware } from "../../middleware/DoctorProtectedMiddleware";
import { PatientProtectedMiddleware } from "../../middleware/PatientProtectedMiddleware";

const router = express.Router();

router.post("/", DoctorProtectedMiddleware, createConsultation);
router.get("/doctor", DoctorProtectedMiddleware, getConsultationForDoctor);
router.get("/patient", PatientProtectedMiddleware, getConsultationForPatient);
router.get("/:id", DoctorProtectedMiddleware, getSingleConsultationForDoctor);
router.get("/:id", PatientProtectedMiddleware, getConsultationForPatient);

export default router;
