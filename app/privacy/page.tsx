export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <div className="space-y-4">
        <section>
          <h2 className="text-xl font-semibold mb-2">Information We Collect</h2>
          <p className="text-gray-300">
            We collect calendar information from Google Calendar to display your schedule in our dashboard.
            This includes event titles, dates, times, and calendar metadata.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-2">How We Use Information</h2>
          <p className="text-gray-300">
            We use your calendar data solely to display it in your personal dashboard.
            We do not share, sell, or transmit your data to third parties.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-2">Data Storage</h2>
          <p className="text-gray-300">
            Calendar tokens are stored securely in our database. We do not store actual event content
            beyond what is needed to display your current schedule.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-2">Contact</h2>
          <p className="text-gray-300">
            For privacy concerns, contact: privacy@textflow-dashboard.vercel.app
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-2">Last Updated</h2>
          <p className="text-gray-300">April 9, 2026</p>
        </section>
      </div>
    </div>
  );
}