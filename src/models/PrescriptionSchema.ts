import mongoose, { Document } from "mongoose";

export interface IPrescription extends Document {
  consultationId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  patientId: mongoose.Types.ObjectId;
  careToBeTaken: string;
  medicines: string;
  pdfPath?: string;
  status: "draft" | "sent";
  createdAt: Date;
  updatedAt: Date;
}

const PrescriptionSchema = new mongoose.Schema(
  {
    consultationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Consultations",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctors",
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patients",
      required: true,
    },
    careToBeTaken: {
      type: String,
      required: true,
      trim: true,
    },
    medicines: {
      type: String,
      trim: true,
      default: "",
    },
    pdfPath: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["draft", "sent"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  }
);

const Prescriptions = mongoose.model<IPrescription>(
  "Prescriptions",
  PrescriptionSchema
);

export default Prescriptions;
