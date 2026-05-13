"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Loader2, Save, User as UserIcon } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function CandidateProfile() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    resumeLink: "",
    portfolioLinks: "",
    skills: "",
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/users/profile");
        const data = await res.json();
        if (res.ok) {
          setFormData({
            name: data.name || "",
            resumeLink: data.resumeLink || "",
            portfolioLinks: data.portfolioLinks ? data.portfolioLinks.join(", ") : "",
            skills: data.skills ? data.skills.join(", ") : "",
          });
        }
      } catch (error) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const processedData = {
      name: formData.name,
      resumeLink: formData.resumeLink,
      portfolioLinks: formData.portfolioLinks.split(",").map(link => link.trim()).filter(Boolean),
      skills: formData.skills.split(",").map(skill => skill.trim()).filter(Boolean),
    };

    try {
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(processedData),
      });

      if (res.ok) {
        toast.success("Profile updated successfully!");
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Toaster position="top-right" />
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="bg-indigo-100 dark:bg-indigo-900/30 p-4 rounded-full">
            <UserIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Profile</h1>
            <p className="text-gray-600 dark:text-gray-400">Update your details to stand out to recruiters.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
            <input 
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white" 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Default Resume Link</label>
            <input 
              type="url"
              value={formData.resumeLink}
              onChange={e => setFormData({...formData, resumeLink: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white" 
              placeholder="Google Drive or Dropbox link..."
            />
            <p className="text-xs text-gray-500 mt-2">This will auto-fill when you apply for jobs.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Portfolio Links (Comma Separated)</label>
            <input 
              value={formData.portfolioLinks}
              onChange={e => setFormData({...formData, portfolioLinks: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white" 
              placeholder="https://github.com/yourusername, https://yourwebsite.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Skills (Comma Separated)</label>
            <textarea 
              rows={3}
              value={formData.skills}
              onChange={e => setFormData({...formData, skills: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white" 
              placeholder="React, Next.js, Tailwind CSS, TypeScript..."
            />
          </div>

          <button 
            type="submit" 
            disabled={saving}
            className="w-full sm:w-auto bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save Profile Updates
          </button>
        </form>
      </div>
    </div>
  );
}
