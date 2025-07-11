import express, { Request, Response } from "express";
import {
  patientLogin,
  PatientLogout,
  patientsSignUp,
} from "../../controllers/patientAuthController/patientAuthController";
import { PatientProtectedMiddleware } from "../../middleware/PatientProtectedMiddleware";

const router = express.Router();

router.post("/signup", patientsSignUp);
router.post("/login", patientLogin);
router.post("/logout", PatientLogout);
router.get(
  "/me",
  PatientProtectedMiddleware,
  (req: Request, res: Response) => {
    res.status(200).json({ patient: req.patient });
  }
);

export default router;
