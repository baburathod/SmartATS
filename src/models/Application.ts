import mongoose, { Schema, Document, models } from "mongoose";

export interface IApplication extends Document {
  jobId: mongoose.Types.ObjectId;
  candidateId: mongoose.Types.ObjectId;
  status: "Pending" | "Review" | "Accepted" | "Rejected";
  resumeLink: string;
  coverLetter?: string;
  aiScore?: number;
  aiSummary?: string;
  appliedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>({
  jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
  candidateId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: { 
    type: String, 
    enum: ["Pending", "Review", "Accepted", "Rejected"], 
    default: "Pending" 
  },
  resumeLink: { type: String, required: true },
  coverLetter: { type: String },
  aiScore: { type: Number },
  aiSummary: { type: String },
  appliedAt: { type: Date, default: Date.now }
});

export const Application = models.Application || mongoose.model<IApplication>("Application", ApplicationSchema);
