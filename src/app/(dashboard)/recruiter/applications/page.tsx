"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Loader2, Search, Eye } from "lucide-react";

export default function ApplicationsPage() {
  const { data: session } = useSession();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
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

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setApplications(apps => apps.map((app: any) => app._id === id ? { ...app, status: newStatus } : app));
      }
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const filteredApps = applications.filter((app: any) => 
    app.candidateId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.jobId?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-10 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Candidate Applications</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Review, filter, and update candidate statuses.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search candidates or jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white transition-all"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Candidate</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Applied Role</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">AI Insight</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Workflow Action</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No applications match your search.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app: any) => (
                  <tr key={app._id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-900 dark:text-white">{app.candidateId?.name}</div>
                      <div className="text-sm text-gray-500 mb-2">{app.candidateId?.email}</div>
                      <a href={app.resumeLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 text-xs font-bold flex items-center gap-1 transition-colors">
                        <Eye className="w-3 h-3" /> View Resume
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white font-medium">{app.jobId?.title}</div>
                      <div className="text-xs text-gray-500 mt-1">Applied: {new Date(app.appliedAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      {app.aiScore !== undefined ? (
                        <div>
                          <div className={`text-sm font-bold ${app.aiScore > 75 ? 'text-green-600' : app.aiScore > 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {app.aiScore}% Match
                          </div>
                          <div className="text-xs text-gray-500 mt-1 line-clamp-2 max-w-[200px]" title={app.aiSummary}>
                            {app.aiSummary}
                          </div>
                        </div>
                      ) : (
                        <button 
                          onClick={async (e) => {
                            const btn = e.currentTarget;
                            btn.disabled = true;
                            btn.innerText = "Analyzing...";
                            try {
                              const res = await fetch(`/api/applications/${app._id}/ai-score`, { method: "POST" });
                              if(res.ok) fetchApplications();
                            } catch(e) {}
                          }}
                          className="bg-purple-100 text-purple-700 hover:bg-purple-200 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                        >
                          ✨ Analyze with AI
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full 
                        ${app.status === 'Accepted' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                          app.status === 'Rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 
                          app.status === 'Review' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : 
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <select 
                        value={app.status}
                        onChange={(e) => updateStatus(app._id, e.target.value)}
                        className="border border-gray-300 dark:border-gray-600 rounded-lg text-sm py-1.5 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white font-medium shadow-sm transition-shadow cursor-pointer outline-none"
                      >
                        <option value="Pending">Move to Pending</option>
                        <option value="Review">In Review</option>
                        <option value="Accepted">Accept Candidate</option>
                        <option value="Rejected">Reject Candidate</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
