import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import Doctors from "../models/DoctorSchema";
import Patients from "../models/PatientSchema";

interface CustomJwtPayload extends JwtPayload {
  id: string;
}

export const PatientProtectedMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { patientToken } = req.cookies;
    if (!patientToken) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const secret = process.env.JWT_SECRET_KEY;
    if (!secret) {
      res.status(500).json("server config error of jwt env");
      return;
    }

    const decode = jwt.verify(patientToken, secret) as CustomJwtPayload;

    if (!decode || !decode.id) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }

    const patient = await Patients.findOne({ _id: decode.id }).select(
      "-password"
    );

    if (!patient) {
      res.status(401).json({ message: "patient not found " });
      return;
    }
    req.patients = patient;
    next();
  } catch (error) {
    console.log("error in protected middleware", error);
    res.status(401).json({ message: "Unauthenticated" });
  }
};
