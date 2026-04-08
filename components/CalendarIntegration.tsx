'use client';

import { useState, useEffect } from 'react';

interface Appointment {
  id: number;
  title: string;
  description: string;
  clientName: string;
  clientPhone: string;
  scheduledTime: string;
  duration: number; // minutes
  status: 'scheduled' | 'completed' | 'cancelled';
  meetingLink?: string;
  createdBy: string;
}

const mockAppointments: Appointment[] = [
  {
    id: 1,
    title: 'Initial Consultation',
    description: 'Discuss TextFlow AI implementation',
    clientName: 'John Smith',
    clientPhone: '+1 (555) 123-4567',
    scheduledTime: '2026-04-08T14:00:00',
    duration: 30,
    status: 'scheduled',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    createdBy: 'AI Agent'
  },
  {
    id: 2,
    title: 'Product Demo',
    description: 'Demo SMS automation features',
    clientName: 'Sarah Wilson',
    clientPhone: '+1 (555) 987-6543',
    scheduledTime: '2026-04-09T10:30:00',
    duration: 45,
    status: 'scheduled',
    meetingLink: 'https://meet.google.com/xyz-uvw-rst',
    createdBy: 'Manual'
  },
  {
    id: 3,
    title: 'Q2 Strategy Review',
    description: 'Quarterly performance review',
    clientName: 'Mike Johnson',
    clientPhone: '+1 (555) 234-5678',
    scheduledTime: '2026-04-07T16:00:00',
    duration: 60,
    status: 'completed',
    createdBy: 'AI Agent'
  }
];

export default function CalendarIntegration() {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [showForm, setShowForm] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    title: '',
    description: '',
    clientName: '',
    clientPhone: '',
    scheduledTime: '',
    duration: 30
  });

  const formatAppointmentTime = (dateTime: string) => {
    const date = new Date(dateTime);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const appointmentDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (appointmentDate.getTime() === today.getTime()) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (appointmentDate.getTime() === today.getTime() + 86400000) {
      return `Tomorrow at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  const handleCreateAppointment = () => {
    if (!newAppointment.title || !newAppointment.clientName || !newAppointment.scheduledTime) {
      alert('Please fill in required fields');
      return;
    }

    const appointment: Appointment = {
      id: appointments.length + 1,
      title: newAppointment.title,
      description: newAppointment.description,
      clientName: newAppointment.clientName,
      clientPhone: newAppointment.clientPhone,
      scheduledTime: newAppointment.scheduledTime,
      duration: newAppointment.duration,
      status: 'scheduled',
      meetingLink: `https://meet.google.com/${Math.random().toString(36).substring(2, 15)}`,
      createdBy: 'Manual'
    };

    setAppointments(prev => [appointment, ...prev]);
    setNewAppointment({
      title: '',
      description: '',
      clientName: '',
      clientPhone: '',
      scheduledTime: '',
      duration: 30
    });
    setShowForm(false);
  };

  const upcomingAppointments = appointments
    .filter(apt => apt.status === 'scheduled')
    .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime());

  return (
    <div className="space-y-4">
      <div className="flex space-x-3">
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold"
        >
          {showForm ? 'Cancel' : '+ New Appointment'}
        </button>
        <button className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold">
          📅 Connect Calendar
        </button>
      </div>

      {showForm && (
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <h4 className="text-lg font-semibold text-white mb-4">Schedule New Appointment</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Title *</label>
              <input
                type="text"
                value={newAppointment.title}
                onChange={(e) => setNewAppointment(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                placeholder="Meeting title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Client Name *</label>
              <input
                type="text"
                value={newAppointment.clientName}
                onChange={(e) => setNewAppointment(prev => ({ ...prev, clientName: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                placeholder="Client name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Client Phone</label>
              <input
                type="tel"
                value={newAppointment.clientPhone}
                onChange={(e) => setNewAppointment(prev => ({ ...prev, clientPhone: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Duration (minutes)</label>
              <select
                value={newAppointment.duration}
                onChange={(e) => setNewAppointment(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
              <textarea
                value={newAppointment.description}
                onChange={(e) => setNewAppointment(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                placeholder="Meeting description"
                rows={2}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">Date & Time *</label>
              <input
                type="datetime-local"
                value={newAppointment.scheduledTime}
                onChange={(e) => setNewAppointment(prev => ({ ...prev, scheduledTime: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white"
              />
            </div>
            <div className="col-span-2 flex justify-end space-x-3">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAppointment}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700"
              >
                Create Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h4 className="font-semibold text-white">Upcoming Appointments</h4>
        
        {upcomingAppointments.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>No upcoming appointments.</p>
            <p className="text-sm mt-1">Schedule your first meeting with a client!</p>
          </div>
        ) : (
          upcomingAppointments.map((appointment) => (
            <div key={appointment.id} className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-400">📅</span>
                    <h5 className="font-semibold text-white">{appointment.title}</h5>
                    <span className="text-xs px-2 py-1 bg-green-900/30 text-green-400 rounded-full">
                      {appointment.createdBy}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mt-1">{appointment.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                    <span>👤 {appointment.clientName}</span>
                    <span>📞 {appointment.clientPhone}</span>
                    <span>⏱️ {appointment.duration} min</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white">{formatAppointmentTime(appointment.scheduledTime)}</p>
                  {appointment.meetingLink && (
                    <a
                      href={appointment.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      Join Meeting ↗
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="text-center text-sm text-gray-400">
        Connect Google Calendar to sync appointments automatically
      </div>
    </div>
  );
}