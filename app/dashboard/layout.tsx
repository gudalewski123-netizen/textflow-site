import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TextFlow Dashboard",
  description: "AI Voice Calling & SMS Management",
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/auth/login");
  }

  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-gray-900 to-black text-white`}>
        <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20 text-white px-6 py-4 shadow-2xl">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-white">TextFlow <span className="text-blue-400">AI</span></h1>
              <div className="flex space-x-6">
                <a href="/dashboard" className="text-gray-300 hover:text-blue-400 font-medium transition-colors">
                  Overview
                </a>
                <a href="/dashboard/calendar" className="text-gray-300 hover:text-blue-400 font-medium transition-colors">
                  Calendar
                </a>
                <a href="/dashboard/support" className="text-gray-300 hover:text-blue-400 font-medium transition-colors">
                  Support
                </a>
                <a href="/dashboard/settings" className="text-gray-300 hover:text-blue-400 font-medium transition-colors">
                  Settings
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-blue-400">{data.user.email}</span>
              <form action="/auth/signout" method="post">
                <button className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto py-8 px-4">{children}</main>
      </body>
    </html>
  );
}