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
      <body className={`${inter.className} min-h-screen bg-[#050505] text-white`}>
        <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
          <div className="text-2xl font-extrabold tracking-tighter">TEXT<span className="text-cyan-400">FLOW</span></div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
            <a href="/dashboard" className="hover:text-white transition">Overview</a>
            <a href="/dashboard/messages" className="hover:text-white transition">Messages</a>
            <a href="/dashboard/studio" className="hover:text-white transition">AI Studio</a>
            <a href="/dashboard/calendar" className="hover:text-white transition">Calendar</a>
            <a href="/dashboard/integrations" className="hover:text-white transition">Integrations</a>
            <a href="/dashboard/support" className="hover:text-white transition">Support</a>
            <a href="/dashboard/settings" className="hover:text-white transition">Settings</a>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-cyan-400">{data.user.email}</span>
            <a href="/auth/signout" className="text-sm text-gray-400 hover:text-cyan-400 transition">
              Sign out
            </a>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto py-8 px-4">{children}</main>
      </body>
    </html>
  );
}