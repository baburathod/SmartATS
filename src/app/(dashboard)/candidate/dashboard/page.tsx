"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Briefcase, MapPin, Building, ArrowRight } from "lucide-react";

export default function CandidateDashboard() {
  const { data: session } = useSession();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch("/api/jobs");
        const data = await res.json();
        setJobs(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  if (loading) return <div className="p-8 text-center mt-12 animate-pulse text-gray-500">Loading available roles...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Find Your Dream Role</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-3">Browse the latest open positions posted by top recruiters on SmartATS.</p>
      </div>

      <div className="relative max-w-2xl mx-auto md:mx-0 mb-10 group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
        </div>
        <input
          type="text"
          className="block w-full pl-12 pr-4 py-4 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white transition-all text-base bg-white"
          placeholder="Search for jobs by title, keyword, or company..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <Briefcase className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">No jobs available right now</h3>
            <p className="text-gray-500 mt-2">Check back later for new opportunities!</p>
          </div>
        ) : (
          jobs.map((job: any) => (
            <div key={job._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col h-full group">
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">{job.title}</h3>
                </div>
                
                {job.recruiterId?.companyName ? (
                  <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 mb-4">
                    <Building className="w-4 h-4" /> {job.recruiterId.companyName}
                  </p>
                ) : (
                  <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 mb-4">
                    <Building className="w-4 h-4" /> Confidential Company
                  </p>
                )}
                
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-6">{job.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {job.department && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      <Briefcase className="w-3.5 h-3.5" /> {job.department}
                    </span>
                  )}
                  {job.location && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                      <MapPin className="w-3.5 h-3.5" /> {job.location}
                    </span>
                  )}
                </div>
              </div>
              <Link href={`/candidate/jobs/${job._id}/apply`} className="w-full flex items-center justify-center gap-2 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 hover:bg-indigo-600 hover:text-white py-3 rounded-xl font-bold transition-all group-hover:bg-indigo-600 group-hover:text-white">
                Apply Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
