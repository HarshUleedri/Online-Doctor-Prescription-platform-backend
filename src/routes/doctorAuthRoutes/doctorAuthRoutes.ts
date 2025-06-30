import express, { Request, Response } from "express";
import {
  doctorLogin,
  doctorLogout,
  doctorSignUp,
  getAllDoctor,
  getSingleDoctor,
} from "../../controllers/doctorAuthController/doctorAuthController";
import { DoctorProtectedMiddleware } from "../../middleware/DoctorProtectedMiddleware";

const router = express.Router();

router.post("/signup", doctorSignUp);
router.post("/login", doctorLogin);
router.post("/logout", doctorLogout);
router.get("/", getAllDoctor);
router.get("/single/:id", getSingleDoctor);
router.get("/me", DoctorProtectedMiddleware, (req: Request, res: Response) => {
  res.status(200).json({ doctor: req.doctor });
});

export default router;
