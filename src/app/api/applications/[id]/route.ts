import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import { Application } from "@/models/Application";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "recruiter") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { status } = await req.json();
    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!["Pending", "Review", "Accepted", "Rejected"].includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    await connectToDatabase();

    const application = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!application) {
      return NextResponse.json({ message: "Application not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Status updated successfully", application }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const resolvedParams = await params;
    await connectToDatabase();

    const application = await Application.findById(resolvedParams.id)
      .populate("candidateId", "name email")
      .populate("jobId", "title companyName location department");

    if (!application) {
      return NextResponse.json({ message: "Application not found" }, { status: 404 });
    }

    return NextResponse.json(application, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const resolvedParams = await params;
    await connectToDatabase();

    const application = await Application.findById(resolvedParams.id);
    if (!application) {
      return NextResponse.json({ message: "Application not found" }, { status: 404 });
    }

    // Only allow Candidates to delete their own, or Recruiters to delete any
    if (session.user.role === "candidate" && application.candidateId.toString() !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await Application.findByIdAndDelete(resolvedParams.id);

    return NextResponse.json({ message: "Application deleted successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
