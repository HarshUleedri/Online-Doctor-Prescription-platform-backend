import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";
export interface IPatient extends Document {
  name: string;
  profilePic: string;
  age: number;
  email: string;
  phone: string;
  password: string;
  historyOfSurgery: string[];
  historyOfIllness: string[];
  comparePassword: (enteredPassword: string) => Promise<boolean>;
}

const PatientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    profilePic: { type: String, default: "" },
    age: { type: Number, required: true },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    phone: { type: String, unique: true },

    historyOfSurgery: { type: [String], default: [] }, // array of strings
    historyOfIllness: { type: [String], default: [] }, // array of strings
  },
  { timestamps: true }
);

PatientSchema.pre<IPatient>("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

PatientSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  const isPasswordCorrect = await bcrypt.compare(
    enteredPassword,
    this.password
  );
  return isPasswordCorrect;
};

const Patients = mongoose.model<IPatient>("Patients", PatientSchema);

export default Patients;
