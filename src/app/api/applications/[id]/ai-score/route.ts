import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import { Application } from "@/models/Application";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "recruiter") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ message: "GEMINI_API_KEY is missing in .env.local" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const resolvedParams = await params;
    
    await connectToDatabase();
    
    const application = await Application.findById(resolvedParams.id)
      .populate("candidateId", "name skills portfolioLinks")
      .populate("jobId", "title description department");

    if (!application) return NextResponse.json({ message: "Application not found" }, { status: 404 });

    const job = application.jobId as any;
    const candidate = application.candidateId as any;

    const prompt = `
      You are an expert technical recruiter and AI Assistant for SmartATS.
      Evaluate the candidate's fit for the job based on the provided details.
      
      Job Title: ${job.title}
      Job Description: ${job.description}
      Department: ${job.department || "N/A"}
      
      Candidate Name: ${candidate.name}
      Candidate Skills: ${candidate.skills?.length > 0 ? candidate.skills.join(", ") : "Not provided"}
      Cover Letter: ${application.coverLetter || "Not provided"}
      
      Provide your response in JSON format exactly like this:
      {
        "matchScore": <number between 0 and 100>,
        "summary": "<a concise 2 sentence summary of why they fit or don't fit>"
      }
    `;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash", 
      generationConfig: { responseMimeType: "application/json" } 
    });
    
    const result = await model.generateContent(prompt);
    const aiResponse = JSON.parse(result.response.text());

    application.aiScore = aiResponse.matchScore;
    application.aiSummary = aiResponse.summary;
    await application.save();

    return NextResponse.json(aiResponse, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
