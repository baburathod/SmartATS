import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import { User } from "@/models/User";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const user = await User.findById(session.user.id).select("-password");
    
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });
    
    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const data = await req.json();
    await connectToDatabase();

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { $set: data },
      { new: true, runValidators: true }
    ).select("-password");

    return NextResponse.json({ message: "Profile updated successfully", user: updatedUser }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
