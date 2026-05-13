import mongoose, { Schema, Document, models } from "mongoose";

export interface IJob extends Document {
  title: string;
  description: string;
  department?: string;
  location?: string;
  recruiterId: mongoose.Types.ObjectId;
  status: "open" | "closed";
  createdAt: Date;
}

const JobSchema = new Schema<IJob>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  department: { type: String },
  location: { type: String },
  recruiterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["open", "closed"], default: "open" },
  createdAt: { type: Date, default: Date.now }
});

export const Job = models.Job || mongoose.model<IJob>("Job", JobSchema);
