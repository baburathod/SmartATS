import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  // If the user is already logged in, redirect them directly to their dashboard!
  const session = await getServerSession(authOptions);
  
  if (session?.user) {
    if (session.user.role === "recruiter") {
      redirect("/recruiter/dashboard");
    } else {
      redirect("/candidate/dashboard");
    }
  }

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-6xl drop-shadow-sm">
            Next-Gen <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">SmartATS</span> for Modern Teams
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            The AI-Assisted Applicant Tracking System designed to help recruiters find the best talent and empower candidates to land their dream roles efficiently.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/register"
              className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-500 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 flex items-center gap-2 transition-all"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/login" className="text-sm font-semibold leading-6 text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Log in <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
