'use client';

interface CreditBalanceProps {
  balance: number;
}

export default function CreditBalance({ balance }: CreditBalanceProps) {
  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calculateSMSCount = (amount: number) => {
    const smsPrice = 0.0189;
    return Math.floor(amount / smsPrice);
  };

  const smsCount = calculateSMSCount(balance);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white">Account Balance</h3>
      
      {/* Current Balance */}
      <div className="text-center p-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl">
        <div className="text-3xl font-bold text-white">
          {formatBalance(balance)}
        </div>
        <div className="text-sm text-gray-300 mt-1">
          ≈ {smsCount.toLocaleString()} SMS credits
        </div>
      </div>

      {/* Add Credits Button */}
      <button
        onClick={() => window.location.href = '/dashboard/billing'}
        className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold"
      >
        Add Credits
      </button>

      {/* SMS Pricing */}
      <div className="text-center text-sm text-gray-400">
        <p>SMS rate: $0.0189 per message</p>
        <p className="mt-1">No setup fees • No monthly limits • 60% margin</p>
      </div>

      {/* Quick Top-up Options */}
      <div className="grid grid-cols-2 gap-2 text-center">
        {[20, 30, 40, 50].map((amount) => (
          <button
            key={amount}
            onClick={() => window.location.href = `/dashboard/billing?amount=${amount}`}
            className="py-2 bg-gradient-to-r from-blue-700/30 to-purple-700/30 text-white text-sm rounded-lg hover:from-blue-600/40 hover:to-purple-600/40 transition-all duration-200 font-medium"
          >
            +${amount}
          </button>
        ))}
      </div>
      
      {/* Custom Amount */}
      <button
        onClick={() => window.location.href = '/dashboard/billing?custom=true'}
        className="w-full py-2 bg-white/5 text-white text-sm rounded-lg hover:bg-white/10 transition-all duration-200 border border-white/10"
      >
        Custom Amount
      </button>
    </div>
  );
}