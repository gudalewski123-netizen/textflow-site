'use client';

const mockActivity = [
  {
    id: 1,
    type: 'sms_sent',
    description: 'Sent 50 messages for Q2 Sales Push',
    time: '2 minutes ago',
    amount: 0.53,
    status: 'completed'
  },
  {
    id: 2,
    type: 'credit_added',
    description: 'Added $100 credits to account',
    time: '15 minutes ago',
    amount: 100,
    status: 'completed'
  },
  {
    id: 3,
    type: 'campaign_created',
    description: 'Created new campaign: New Client Onboarding',
    time: '1 hour ago',
    amount: 0,
    status: 'completed'
  },
  {
    id: 4,
    type: 'voice_call',
    description: 'Scheduled 20 AI voice calls',
    time: '3 hours ago',
    amount: 6.00,
    status: 'scheduled'
  },
  {
    id: 5,
    type: 'response_received',
    description: '12 new responses to Q2 campaign',
    time: '5 hours ago',
    amount: 0,
    status: 'success'
  }
];

export default function RecentActivity() {
  const getIcon = (type: string) => {
    switch (type) {
      case 'sms_sent': return '📱';
      case 'credit_added': return '💰';
      case 'campaign_created': return '🚀';
      case 'voice_call': return '📞';
      case 'response_received': return '📨';
      default: return '📝';
    }
  };

  const getColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'scheduled': return 'text-blue-400';
      case 'success': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const formatAmount = (amount: number) => {
    if (amount === 0) return '';
    return amount > 0 
      ? `+$${amount.toFixed(2)}`
      : `-$${Math.abs(amount).toFixed(2)}`;
  };

  return (
    <div className="space-y-3">
      {mockActivity.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-200">
          <div className="text-xl">{getIcon(activity.type)}</div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white truncate">
              {activity.description}
            </p>
            <p className="text-xs text-gray-400">
              {activity.time}
            </p>
          </div>

          {activity.amount !== 0 && (
            <div className={`text-xs font-semibold ${activity.amount > 0 ? 'text-green-400' : 'text-white'}`}>
              {formatAmount(activity.amount)}
            </div>
          )}

          <span className={`text-xs ${getColor(activity.status)}`}>
            ●
          </span>
        </div>
      ))}

      {mockActivity.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p>No recent activity</p>
          <p className="text-sm mt-1">Actions will appear here</p>
        </div>
      )}
    </div>
  );
}