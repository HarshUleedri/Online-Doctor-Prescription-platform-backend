import { Request, Response } from "express";
import { generateAccessToken } from "../../utils/generateToken";
import Patients from "../../models/PatientSchema";

export const patientsSignUp = async (req: Request, res: Response) => {
  try {
    const {
      name,
      profilePic,
      age,
      email,
      phone,
      password,
      historyOfSurgery,
      historyOfIllness,
    } = req.body;

    if (!name || !email || !password || !age || !phone) {
      res.status(400).json({ message: "ALL fields are required" });
      return;
    }

    if (password.length < 6) {
      res
        .status(400)
        .json({ message: "Password Must Be at least 6 character" });

      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      res.status(400).json({ message: "Invalid email Format " });
      return;
    }

    const patient = await Patients.findOne({
      $or: [{ phone }, { email }],
    });

    if (patient) {
      if (patient.phone === phone) {
        res.status(400).json({ message: "Phone Number is used already " });
        return;
      } else {
        res.status(400).json({ message: "email is used already " });
        return;
      }
    }

    const newPatient = await Patients.create({
      name,
      email,
      phone,
      age,
      password,
      profilePic,
      historyOfSurgery,
      historyOfIllness,
    });

    const patientAccessToken = generateAccessToken(
      (newPatient._id as string).toString()
    );

    res.cookie("patientToken", patientAccessToken, {
      httpOnly: true,
      sameSite: "none",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({ success: true, message: "Successful Sign Up" });
  } catch (error) {
    console.log("Error at Patient sign up controller", error);
    res.status(500).json({ message: "Internal server Error" });
  }
};

export const patientLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const patient = await Patients.findOne({ email });
    if (!patient) {
      res.status(404).json({ message: "patient does not exists" });
      return;
    }
    const isPasswordCorrect = await patient.comparePassword(password);

    if (!isPasswordCorrect) {
      res.status(401).json({ message: "Invalid Credential" });
      return;
    }
    const patientAccessToken = generateAccessToken(
      (patient._id as string).toString()
    );

    res.cookie("patientToken", patientAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ success: true, message: "Successful login" });
  } catch (error) {
    console.log("Error at Patient login controller", error);
    res.status(500).json({ message: "Internal server Error" });
  }
};
export const PatientLogout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("patientToken");
    res.json({ message: "logged out" });
  } catch (error) {
    console.log("Error at Patient logout controller", error);
    res.status(500).json({ message: "Internal server Error" });
  }
};
