'use client';

export default function QuickActions() {
  const actions = [
    {
      title: 'Send Quick SMS',
      description: 'Send individual messages instantly',
      icon: '📱',
      action: () => console.log('Quick SMS'),
      color: 'from-blue-600 to-blue-700'
    },
    {
      title: 'Upload CSV',
      description: 'Bulk upload contacts for campaigns',
      icon: '📊',
      action: () => console.log('Upload CSV'),
      color: 'from-green-600 to-green-700'
    },
    {
      title: 'AI Voice Call',
      description: 'Schedule automated voice outreach',
      icon: '📞',
      action: () => console.log('Voice Call - Coming Soon'),
      color: 'from-gray-600 to-gray-700',
      disabled: true
    },
    {
      title: 'Analytics Report',
      description: 'Generate performance insights',
      icon: '📈',
      action: () => console.log('Analytics'),
      color: 'from-orange-600 to-orange-700'
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white">Quick Actions</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className={`flex flex-col items-center p-4 bg-gradient-to-r ${action.color} text-white rounded-lg hover:shadow-lg transition-all duration-200 ${action.disabled ? 'opacity-50 cursor-not-allowed' : 'transform hover:scale-105'}`}
            disabled={action.disabled}
          >
            <span className="text-2xl mb-2">{action.icon}</span>
            <span className="font-semibold text-sm">{action.title}</span>
            <span className="text-xs opacity-90">{action.description}</span>
            {action.disabled && (
              <span className="mt-1 text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">
                Coming Soon
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="bg-white/5 rounded-lg p-4">
        <h4 className="font-semibold text-white mb-2">Today's Activity</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-400">Messages Sent</div>
            <div className="text-white font-semibold">142</div>
          </div>
          <div>
            <div className="text-gray-400">Responses</div>
            <div className="text-green-400 font-semibold">23</div>
          </div>
          <div>
            <div className="text-gray-400">Cost</div>
            <div className="text-white font-semibold">$1.49</div>
          </div>
          <div>
            <div className="text-gray-400">Response Rate</div>
            <div className="text-green-400 font-semibold">16.2%</div>
          </div>
        </div>
      </div>
    </div>
  );
}