"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Briefcase } from "lucide-react";
import Link from "next/link";

export default function ApplyJobPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    resumeLink: "",
    coverLetter: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, jobId: resolvedParams.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit application");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/candidate/dashboard");
      }, 2000);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-12 rounded-3xl shadow-sm border border-green-100 dark:border-green-800">
          <Briefcase className="mx-auto h-20 w-20 mb-6 text-green-500" />
          <h2 className="text-4xl font-bold mb-4">Application Submitted!</h2>
          <p className="text-lg">Redirecting you back to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/candidate/dashboard" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 font-semibold mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Jobs
      </Link>
      
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Submit Your Application</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Provide your resume and a cover letter to apply for this position.</p>
        
        {error && <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-medium p-4 rounded-lg mb-6">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Resume Link *</label>
            <input 
              required
              type="url"
              value={formData.resumeLink}
              onChange={e => setFormData({...formData, resumeLink: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-shadow" 
              placeholder="https://drive.google.com/..." 
            />
            <p className="text-xs text-gray-500 mt-2">Please provide a public link to your resume (Google Drive, Dropbox, Portfolio, etc.)</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Cover Letter (Optional)</label>
            <textarea 
              rows={6}
              value={formData.coverLetter}
              onChange={e => setFormData({...formData, coverLetter: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-shadow" 
              placeholder="Why are you a great fit for this role?" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
}
