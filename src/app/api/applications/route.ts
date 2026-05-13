import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import { Application } from "@/models/Application";
import { Job } from "@/models/Job";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "candidate") {
      return NextResponse.json({ message: "Only candidates can apply" }, { status: 401 });
    }

    const { jobId, resumeLink, coverLetter } = await req.json();

    if (!jobId || !resumeLink) {
      return NextResponse.json({ message: "Job ID and Resume Link are required" }, { status: 400 });
    }

    await connectToDatabase();

    const existingApp = await Application.findOne({ jobId, candidateId: session.user.id });
    if (existingApp) {
      return NextResponse.json({ message: "You have already applied for this job" }, { status: 400 });
    }

    const application = await Application.create({
      jobId,
      candidateId: session.user.id,
      resumeLink,
      coverLetter
    });

    return NextResponse.json({ message: "Application submitted successfully", application }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await connectToDatabase();

    if (session.user.role === "candidate") {
      const apps = await Application.find({ candidateId: session.user.id })
        .populate("jobId", "title companyName")
        .sort({ appliedAt: -1 });
      return NextResponse.json(apps, { status: 200 });
    } else {
      // Recruiter fetching applications for their jobs
      const jobs = await Job.find({ recruiterId: session.user.id }).select("_id");
      const jobIds = jobs.map(j => j._id);

      const apps = await Application.find({ jobId: { $in: jobIds } })
        .populate("candidateId", "name email skills")
        .populate("jobId", "title")
        .sort({ appliedAt: -1 });
      return NextResponse.json(apps, { status: 200 });
    }
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
