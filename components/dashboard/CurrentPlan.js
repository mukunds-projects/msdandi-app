'use client';

export default function CurrentPlan() {
  return (
    <div className="mb-8 rounded-2xl overflow-hidden bg-gradient-to-r from-rose-200 via-purple-300 to-blue-300 p-8">
      <div className="text-white">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium">CURRENT PLAN</span>
          <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full text-sm">
            Manage Plan
          </button>
        </div>
        <h2 className="text-4xl font-bold mb-6">Researcher</h2>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm">API Limit</span>
            <span className="text-white/60">ⓘ</span>
          </div>
          <div className="bg-white/20 rounded-full h-2 w-full">
            <div className="bg-white rounded-full h-2 w-[0%]"></div>
          </div>
          <span className="text-sm">0/1,000 Requests</span>
        </div>
      </div>
    </div>
  );
} 