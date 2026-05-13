import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import { Job } from "@/models/Job";
import { User } from "@/models/User"; // Ensure User schema is loaded for population

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    // Fetch all open jobs, populating the recruiter's name and company
    const jobs = await Job.find({ status: "open" })
      .populate("recruiterId", "name companyName")
      .sort({ createdAt: -1 });
      
    return NextResponse.json(jobs, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: "Error fetching jobs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "recruiter") {
      return NextResponse.json({ message: "Unauthorized: Only recruiters can post jobs" }, { status: 401 });
    }

    const { title, description, department, location } = await req.json();

    if (!title || !description) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    await connectToDatabase();

    const newJob = await Job.create({
      title,
      description,
      department,
      location,
      recruiterId: session.user.id
    });

    return NextResponse.json({ message: "Job created successfully", job: newJob }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Error creating job" }, { status: 500 });
  }
}
