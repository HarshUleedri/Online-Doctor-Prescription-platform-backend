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

router.post("/", PatientProtectedMiddleware, createConsultation);
router.get("/doctor", DoctorProtectedMiddleware, getConsultationForDoctor);
router.get("/patient", PatientProtectedMiddleware, getConsultationForPatient);
router.get(
  "/single/:id",
  DoctorProtectedMiddleware,
  getSingleConsultationForDoctor
);
router.get("/all/:id", PatientProtectedMiddleware, getConsultationForPatient);

export default router;
