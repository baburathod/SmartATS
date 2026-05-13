import mongoose, { Schema, Document, models } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: "candidate" | "recruiter";
  resumeLink?: string;
  portfolioLinks?: string[];
  skills?: string[];
  companyName?: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional for OAuth, required for Credentials
  role: { type: String, enum: ["candidate", "recruiter"], default: "candidate" },
  resumeLink: { type: String },
  portfolioLinks: [{ type: String }],
  skills: [{ type: String }],
  companyName: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const User = models.User || mongoose.model<IUser>("User", UserSchema);
