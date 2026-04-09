"use client";

export default function SupportPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Contact Support</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Having issues with TextFlow? Email us directly and our team will help you resolve it.
          </p>
        </div>

        <div className="bg-gradient-to-br from-black/40 to-cyan-900/20 backdrop-blur-2xl border-2 border-cyan-500/30 rounded-3xl shadow-2xl p-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-8 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full shadow-lg">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M5.478 5.559A1.5 1.5 0 016.912 4.5H9A.75.75 0 009 3H6.912a3 3 0 00-2.868 2.118l-2.411 7.838a3 3 0 00-.133.882V18a3 3 0 003 3h15a3 3 0 003-3v-4.162c0-.299-.045-.596-.133-.882l-2.411-7.838A3 3 0 0017.088 3H15a.75.75 0 000 1.5h2.088a1.5 1.5 0 011.434 1.059l2.213 7.191H3.265l2.213-7.191z" clipRule="evenodd" />
              </svg>
            </div>
            
            <h2 className="text-4xl font-bold text-white mb-6">Email Support</h2>
            <p className="text-white/90 text-lg mb-10 max-w-2xl mx-auto">
              For any technical issues, billing questions, or feature requests, email us directly.
              We typically respond within 2 hours during business hours (9 AM - 5 PM EST, Mon-Fri).
            </p>
            
            <div className="bg-black/40 border-2 border-cyan-500 rounded-2xl p-8 mb-10">
              <div className="text-cyan-400 text-5xl font-extrabold mb-4 tracking-tight">
                admin@textflow.tech
              </div>
              <p className="text-gray-300 text-lg">
                24/7 support for TextFlow AI platform
              </p>
            </div>
            
            <div className="space-y-4">
              <button 
                onClick={() => window.location.href = 'mailto:admin@textflow.tech'}
                className="w-full max-w-md mx-auto px-10 py-5 bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-2xl font-bold rounded-xl hover:scale-105 transition-transform shadow-xl"
              >
                ✉️ Open Email Now
              </button>
              
              <p className="text-gray-400 text-sm max-w-md mx-auto">
                Clicking this button will open your default email client with our support address pre-filled.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-16 text-center text-gray-500 text-sm">
          <p>
            🚀 We're committed to providing excellent support. For urgent matters, you can also contact us on Discord.
          </p>
          <p className="mt-2">
            📞 Response time: Within 2 hours during business hours
          </p>
        </div>
      </div>
    </div>
  );
}