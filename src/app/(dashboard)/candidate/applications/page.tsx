"use client";

import { useEffect, useState } from "react";
import { Loader2, Briefcase, Building } from "lucide-react";
import Link from "next/link";

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMyApplications() {
      try {
        const res = await fetch("/api/applications");
        const data = await res.json();
        if (res.ok) setApplications(data);
      } catch (error) {
        console.error("Failed to fetch applications", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMyApplications();
  }, []);

  if (loading) return <div className="p-10 flex justify-center mt-12"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Applications</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Track the status of the jobs you've applied for.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {applications.length === 0 ? (
          <div className="p-16 text-center text-gray-500">
            <Briefcase className="mx-auto w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">No applications yet</h3>
            <p className="mt-2 mb-8">You haven't applied to any roles. Discover your next dream job today!</p>
            <Link href="/candidate/dashboard" className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-sm">
              Find Jobs Now
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {applications.map((app: any) => (
              <div key={app._id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors gap-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{app.jobId?.title || "Unknown Job Title"}</h3>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-4 mt-2">
                    <span className="font-medium text-gray-600 dark:text-gray-300">Applied on: {new Date(app.appliedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Current Status:</span>
                  <span className={`px-4 py-2 inline-flex text-sm font-bold rounded-full border
                    ${app.status === 'Accepted' ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400' : 
                      app.status === 'Rejected' ? 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400' : 
                      app.status === 'Review' ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400' : 
                      'bg-yellow-50 border-yellow-200 text-yellow-700 dark:bg-yellow-900/30 dark:border-yellow-800 dark:text-yellow-400'}`}>
                    {app.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
