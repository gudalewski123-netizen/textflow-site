"use client";

export default function CalendarPage() {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  
  const appointments = [
    { id: 1, title: 'Sales Call - John Smith', time: 'Today, 3:00 PM', type: 'sales' },
    { id: 2, title: 'Follow-up - Sarah Johnson', time: 'Tomorrow, 11:00 AM', type: 'followup' },
    { id: 3, title: 'New Client Onboarding', time: 'Apr 10, 2:30 PM', type: 'onboarding' },
    { id: 4, title: 'Q2 Strategy Meeting', time: 'Apr 15, 9:00 AM', type: 'internal' }
  ];

  return (
    <div className="space-y-8 text-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-blue-100 mt-2">Manage appointments and schedule</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          + Add Meeting
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Month View */}
        <div className="lg:col-span-2 bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-6">{currentMonth}</h2>
          
          {/* Week days */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-gray-400 font-medium text-sm">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }, (_, i) => (
              <div key={i} className="h-16 border border-gray-600 rounded-lg p-2 text-sm">
                <div className="text-gray-300">{i + 1}</div>
                {i === 6 && <div className="text-xs text-blue-400 mt-1">Sales Call</div>}
                {i === 17 && <div className="text-xs text-green-400 mt-1">Onboarding</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="space-y-6">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Upcoming Appointments</h2>
            <div className="space-y-3">
              {appointments.map(appt => (
                <div key={appt.id} className="border border-gray-600 rounded-lg p-3">
                  <div className="font-medium">{appt.title}</div>
                  <div className="text-gray-300 text-sm mt-1">{appt.time}</div>
                  <div className="text-xs text-blue-400 mt-2">Added by AI assistant</div>
                </div>
              ))}
            </div>
          </div>

          {/* Google Calendar Sync */}
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Google Calendar</h2>
            <p className="text-gray-300 text-sm mb-4">
              Connect your Google Calendar to sync appointments automatically
            </p>
            <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">
              Connect Google Calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}