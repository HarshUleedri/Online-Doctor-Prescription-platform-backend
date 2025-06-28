import { Request, Response } from "express";
import Consultations from "../../models/ConsultationSchema";
import Prescriptions from "../../models/PrescriptionSchema";
import { generatePrescriptionPDF } from "../../utils/generatePrescriptionPDF";
import path from "path";
import fs from "fs";

export const createPrescription = async (req: Request, res: Response) => {
  try {
    const doctorId = req.doctor?._id;
    const { consultationId, careToBeTaken, medicines } = req.body;

    // Verify consultation exists and belongs to this doctor
    const consultation = await Consultations.findOne({
      _id: consultationId,
      doctorId,
    })
      .populate("patientId")
      .populate("doctorId");

    if (!consultation) {
      res
        .status(404)
        .json({ error: "Consultation not found or access denied" });
      return;
    }

    // Check if prescription already exists
    let prescription = await Prescriptions.findOne({ consultationId });

    if (prescription) {
      // Update existing prescription
      prescription.careToBeTaken = careToBeTaken;
      prescription.medicines = medicines || "";
      prescription.status = "draft";
      await prescription.save();
    } else {
      // Create new prescription
      prescription = new Prescriptions({
        consultationId,
        doctorId,
        patientId: consultation.patientId._id,
        careToBeTaken,
        medicines: medicines || "",
        status: "draft",
      });
      await prescription.save();
    }

    res.json({
      message: prescription
        ? "Prescription updated successfully"
        : "Prescription created successfully",
      prescription,
    });
  } catch (error) {
    console.error("Create/Update prescription error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const generateAndSendPDF = async (req: Request, res: Response) => {
  try {
    const doctorId = req.doctor?._id;
    const prescription = await Prescriptions.findOne({
      _id: req.params.id,
      doctorId,
    }).populate([
      { path: "consultationId" },
      { path: "doctorId", select: "name specialty yearsOfExperience" },
      { path: "patientId", select: "name age" },
    ]);

    if (!prescription) {
      res
        .status(404)
        .json({ error: "Prescription not found or access denied" });
      return;
    }

    // Prepare data for PDF generation
    const pdfData = {
      doctorName: (prescription.doctorId as any).name,
      doctorSpecialty: (prescription.doctorId as any).specialty,
      doctorExperience: (prescription.doctorId as any).yearsOfExperience,
      patientName: (prescription.patientId as any).name,
      patientAge: (prescription.patientId as any).age,
      careToBeTaken: prescription.careToBeTaken,
      medicines: prescription.medicines,
    };

    // Generate PDF
    const pdfPath = await generatePrescriptionPDF(pdfData);

    // Update prescription with PDF path
    prescription.pdfPath = pdfPath;
    prescription.status = "sent";
    await prescription.save();

    // Update consultation status
    await Consultations.findByIdAndUpdate(prescription.consultationId, {
      status: "completed",
    });

    res.json({
      message: "Prescription PDF generated and sent successfully",
      pdfPath: `/uploads/prescriptions/${path.basename(pdfPath)}`,
    });
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
        { path: "patientId", select: "name age profilePicture" },
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
      patientId,
      status: "sent", // Only show sent prescriptions to patients
    })
      .populate([
        { path: "consultationId" },
        { path: "doctorId", select: "name specialty profilePicture" },
      ])
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
