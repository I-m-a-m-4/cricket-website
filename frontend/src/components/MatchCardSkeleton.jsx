import React from 'react';

function MatchCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 w-full flex-shrink-0 font-open-sans animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className="px-2 py-1 rounded bg-gray-200 w-16 h-5"></div>
        <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
        <div className="w-24 h-4 bg-gray-200 rounded"></div>
      </div>

      {/* Match Details */}
      <div className="mb-2">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-20 h-4 bg-gray-200 rounded"></div>
          <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
          <div className="w-28 h-4 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Teams */}
      <div className="space-y-4 mb-3">
        {/* Team 1 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
            <div className="w-24 h-5 bg-gray-200 rounded"></div>
          </div>
          <div className="w-12 h-5 bg-gray-200 rounded"></div>
        </div>

        {/* Team 2 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
            <div className="w-24 h-5 bg-gray-200 rounded"></div>
          </div>
          <div className="w-12 h-5 bg-gray-200 rounded"></div>
        </div>

        {/* Match Timing */}
        <div className="flex justify-end pt-1">
          <div className="text-right">
            <div className="w-16 h-4 bg-gray-200 rounded mb-1"></div>
            <div className="w-20 h-6 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      {/* Result/Status */}
      <div className="py-2 bg-gray-50 rounded-lg mb-3">
        <div className="w-3/4 h-4 bg-gray-200 rounded mx-auto"></div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <div className="flex-1 h-6 bg-gray-200 rounded"></div>
        <div className="flex-1 h-6 bg-gray-200 rounded"></div>
        <div className="flex-1 h-6 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

export default MatchCardSkeleton;