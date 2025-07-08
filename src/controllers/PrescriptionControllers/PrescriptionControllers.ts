import { Request, Response } from "express";
import Consultations from "../../models/ConsultationSchema";
import Prescriptions from "../../models/PrescriptionSchema";
import { generatePrescriptionPDF } from "../../utils/generatePrescriptionPDF";
import path from "path";
import fs from "fs";
import { IDoctor } from "../../models/DoctorSchema";
import { IPatient } from "../../models/PatientSchema";

export const createPrescription = async (req: Request, res: Response) => {
  try {
    const doctorId = req.doctor?._id;
    const { consultationId, patientId, careToBeTaken, medicines, pdfUrl } =
      req.body;

    console.log(req.body);
    if (!doctorId) {
      res.status(401).json({ message: "Unauthorized" });
    }
    if (
      !consultationId ||
      !patientId ||
      !careToBeTaken ||
      !medicines ||
      !pdfUrl
    ) {
      res.status(400).json({ message: "Bad Request All fields are required" });
      return;
    }
    const consultation = await Consultations.findOne({
      _id: consultationId,
    });

    if (!consultation) {
      res.status(404).json({ message: "consultation not found" });
      return;
    }

    const newPrescription = await Prescriptions.create({
      consultationId,
      doctorId,
      patientId,
      careToBeTaken,
      medicines,
      pdfUrl,
    });
    if (!newPrescription) {
      res
        .status(500)
        .json({ success: false, message: "Failed to create prescription" });
      return;
    }

    consultation.status = "completed";
    await consultation.save();
    res.status(201).json({ success: true, prescription: newPrescription });
  } catch (error) {
    console.error("Create prescription error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const generatePdfUrl = async (req: Request, res: Response) => {
  try {
    const { consultationId, careToBeTaken, medicines } = req.body;

    console.log(careToBeTaken, medicines);

    if (!careToBeTaken || !medicines || !consultationId) {
      res.status(400).json({ message: "All fields are required " });
    }

    const consultation = await Consultations.findOne({
      _id: consultationId,
    }).populate([
      { path: "patientId", select: "name age" },
      { path: "doctorId", select: "name specialty experience  " },
    ]);

    if (!consultation) {
      res.status(404).json({ message: "Consultation is Invalid" });
    }

    const doctor = consultation?.doctorId as IDoctor;
    const patient = consultation?.patientId as IPatient;

    // Prepare data for PDF generation
    const pdfData = {
      doctorName: doctor?.name,
      doctorSpecialty: doctor?.specialty,
      doctorExperience: doctor?.experience,
      patientName: patient?.name,
      patientAge: patient?.age,
      careToBeTaken: careToBeTaken,
      medicines: medicines,
    };

    // Generate PDF
    const pdfUrl = await generatePrescriptionPDF(pdfData);

    if (!pdfUrl) {
      res.status(404).json({ message: "error generating pdf" });
      return;
    }
    res.status(201).json({ success: true, pdfUrl });
  } catch (error) {
    console.error("Generate PDF error:", error);
    res.status(500).json({ error: "Failed to generate prescription PDF" });
  }
};

export const getPrescriptionForDoctor = async (req: Request, res: Response) => {
  try {
    const doctorId = req.doctor?._id;
    if (!doctorId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const prescriptions = await Prescriptions.find({ doctorId })
      .populate([
        { path: "consultationId" },
        { path: "patientId", select: "name age profilePic" },
      ])
      .sort({ createdAt: -1 });

    res.json({ prescriptions });
  } catch (error) {
    console.error("Get doctor prescriptions error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getPrescriptionForPatient = async (
  req: Request,
  res: Response
) => {
  try {
    const patientId = req.patient?._id;
    if (!patientId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const prescriptions = await Prescriptions.find({
      patientId, // Only show sent prescriptions to patients
    })
      .populate([{ path: "doctorId", select: "name specialty profilePic" }])
      .sort({ createdAt: -1 });

    res.json({ prescriptions });
  } catch (error) {
    console.error("Get patient prescriptions error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const downloadPrescription = async (req: Request, res: Response) => {
  try {
    const prescription = await Prescriptions.findById(req.params.id);

    if (!prescription) {
      res.status(404).json({ error: "Prescription not found" });
      return;
    }

    // Check access permissions
    // const isDoctor =
    //   req.user!.role === "doctor" &&
    //   prescription.doctorId.toString() === req.user!.id;
    // const isPatient =
    //   req.user!.role === "patient" &&
    //   prescription.patientId.toString() === req.user!.id &&
    //   prescription.status === "sent";

    // if (!isDoctor && !isPatient) {
    //   return res.status(403).json({ error: "Access denied" });
    // }

    if (!prescription.pdfPath || !fs.existsSync(prescription.pdfPath)) {
      res.status(404).json({ error: "Prescription PDF not found" });
      return;
    }

    const fileName = `prescription-${prescription._id}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    const fileStream = fs.createReadStream(prescription.pdfPath);
    fileStream.pipe(res);
  } catch (error) {
    console.error("Download prescription error:", error);
    res.status(500).json({ error: "Failed to download prescription" });
  }
};

export const getSinglePrescription = async (req: Request, res: Response) => {
  try {
    const prescription = await Prescriptions.findById(req.params.id).populate([
      { path: "consultationId" },
      {
        path: "doctorId",
        select: "name specialty profilePicture yearsOfExperience",
      },
      { path: "patientId", select: "name age profilePicture" },
    ]);

    if (!prescription) {
      res.status(404).json({ error: "Prescription not found" });
      return;
    }

    // Check access permissions
    // const isDoctor =
    //   req.user!.role === "doctor" &&
    //   prescription.doctorId._id.toString() === req.user!.id;
    // const isPatient =
    //   req.user!.role === "patient" &&
    //   prescription.patientId._id.toString() === req.user!.id &&
    //   prescription.status === "sent";

    // if (!isDoctor && !isPatient) {
    //   return res.status(403).json({ error: "Access denied" });
    // }

    res.json({ prescription });
  } catch (error) {
    console.error("Get prescription error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
