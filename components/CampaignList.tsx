'use client';

import { useState } from 'react';

const mockCampaigns = [
  {
    id: 1,
    name: 'Q2 Sales Push',
    status: 'active',
    messagesSent: 842,
    responseRate: '18.2%',
    cost: 8.84,
    created: '2026-04-01'
  },
  {
    id: 2,
    name: 'New Client Onboarding',
    status: 'paused',
    messagesSent: 312,
    responseRate: '9.8%',
    cost: 3.28,
    created: '2026-04-05'
  },
  {
    id: 3,
    name: 'Product Update Announcement',
    status: 'completed',
    messagesSent: 366,
    responseRate: '15.1%',
    cost: 3.84,
    created: '2026-03-28'
  }
];

export default function CampaignList() {
  const [campaigns] = useState(mockCampaigns);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'paused': return 'text-yellow-400';
      case 'completed': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return '▶️';
      case 'paused': return '⏸️';
      case 'completed': return '✅';
      default: return '❓';
    }
  };

  return (
    <div className="space-y-3">
      {campaigns.map((campaign) => (
        <div key={campaign.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-200">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className={getStatusColor(campaign.status)}>
                {getStatusIcon(campaign.status)}
              </span>
              <h4 className="font-semibold text-white">{campaign.name}</h4>
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(campaign.status)} bg-opacity-20`}>
                {campaign.status}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Created {campaign.created} • {campaign.messagesSent.toLocaleString()} messages sent
            </p>
          </div>
          
          <div className="text-right space-y-1">
            <div className="text-sm text-white">
              Response: <span className="text-green-400">{campaign.responseRate}</span>
            </div>
            <div className="text-sm text-gray-400">
              Cost: ${campaign.cost.toFixed(2)}
            </div>
          </div>
        </div>
      ))}

      {campaigns.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p>No campaigns yet. Create your first campaign to get started!</p>
        </div>
      )}
    </div>
  );
}