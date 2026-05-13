"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Briefcase, UserCircle, LogOut } from "lucide-react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <Briefcase className="h-8 w-8 text-indigo-600 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">SmartATS</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {status === "loading" ? (
              <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            ) : session?.user ? (
              <>
                <Link 
                  href={session.user.role === "recruiter" ? "/recruiter/dashboard" : "/candidate/dashboard"} 
                  className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 font-medium transition-colors"
                >
                  Dashboard
                </Link>
                {session.user.role === "recruiter" && (
                  <Link 
                    href="/recruiter/applications" 
                    className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 font-medium transition-colors"
                  >
                    Applications
                  </Link>
                )}
                {session.user.role === "candidate" && (
                  <>
                    <Link 
                      href="/candidate/applications" 
                      className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 font-medium transition-colors"
                    >
                      My Applications
                    </Link>
                    <Link 
                      href="/candidate/profile" 
                      className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 font-medium transition-colors"
                    >
                      Profile
                    </Link>
                  </>
                )}
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-600 shadow-sm">
                  <UserCircle className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium">{session.user.name}</span>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 font-medium transition-colors">
                  Log in
                </Link>
                <Link href="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 transition-colors shadow-sm">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
