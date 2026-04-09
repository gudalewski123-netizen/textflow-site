export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white p-8">
      <header className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Textflow</h1>
        <p className="text-xl text-gray-300 mb-8">
          A powerful dashboard for managing your calendar, tasks, and productivity workflow
        </p>
        <a 
          href="/privacy" 
          className="text-blue-400 hover:text-blue-300 underline"
        >
          Privacy Policy
        </a>
      </header>
      
      <main className="max-w-4xl mx-auto">
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">About This App</h2>
          <p className="text-gray-300 mb-4">
            TextFlow Dashboard helps you organize your schedule by connecting to your Google Calendar.
            View upcoming events, manage your time, and stay productive with our clean, intuitive interface.
          </p>
          <p className="text-gray-300">
            This application is designed for personal productivity and calendar management.
          </p>
        </section>
        
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-bold mb-4">Getting Started</h3>
          <a 
            href="/dashboard" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Go to Dashboard →
          </a>
        </div>
      </main>
      
      <footer className="max-w-4xl mx-auto mt-12 pt-6 border-t border-gray-800 text-center text-gray-400">
        <p>© 2026 Textflow. All rights reserved.</p>
        <p className="mt-2">
          <a href="/privacy" className="text-blue-400 hover:text-blue-300 underline">
            Privacy Policy
          </a>
        </p>
      </footer>
    </div>
  );
}