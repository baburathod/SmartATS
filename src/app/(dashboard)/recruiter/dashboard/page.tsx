"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { PlusCircle, Briefcase, Users, CheckCircle } from "lucide-react";

export default function RecruiterDashboard() {
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

  if (loading) return <div className="p-8 text-center mt-12 animate-pulse text-gray-500">Loading dashboard data...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Recruiter Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back, <span className="font-semibold">{session?.user?.name}</span></p>
        </div>
        <Link 
          href="/recruiter/jobs/new"
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium"
        >
          <PlusCircle className="w-5 h-5" />
          Post New Job
        </Link>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[ 
          { label: "Active Job Postings", count: jobs.length, icon: Briefcase, color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30" },
          { label: "Total Applications", count: 0, icon: Users, color: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-900/30" },
          { label: "Candidates Hired", count: 0, icon: CheckCircle, color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/30" }
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className={`p-4 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
              <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">{stat.count}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Job Listings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-gray-500" /> Your Recent Postings
          </h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {jobs.length === 0 ? (
            <div className="p-12 text-center text-gray-500 dark:text-gray-400">
              <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Briefcase className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-1">No jobs posted yet.</p>
              <p>Click "Post New Job" to create your first listing.</p>
            </div>
          ) : (
            jobs.map((job: any) => (
              <div key={job._id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors flex justify-between items-center group">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{job.department} • {job.location}</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Active
                  </span>
                  <p className="text-xs text-gray-500 mt-2">Posted {new Date(job.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
