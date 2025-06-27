import express, { Request, Response } from "express";
import {
  doctorLogin,
  doctorLogout,
  doctorSignUp,
} from "../../controllers/doctorAuthController/doctorAuthController";
import { protectedMiddleware } from "../../middleware/DoctorProtectedMiddleware";

const router = express.Router();

router.post("/signup", doctorSignUp);
router.post("/login", doctorLogin);
router.post("/logout", doctorLogout);
router.post("/me", protectedMiddleware, (req: Request, res: Response) => {
  res.status(200).json({ doctor: req.doctor });
});

export default router;
