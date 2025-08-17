import React from 'react';
import { Link } from 'react-router-dom';

function MatchCard({ match, activeFilter }) {
  // Determine match type based on activeFilter with fallback to match data
  const getMatchType = () => {
    switch (activeFilter) {
      case 'live':
        return 'LIVE';
      case 'upcoming':
        return 'UPCOMING';
      case 'finished':
        return 'FINISHED';
      case 'all-matches':
      default:
        if (match.status === 'Live' || match.status_id === 2 || match.note?.toLowerCase().includes('live')) {
          return 'LIVE';
        } else if (match.status === 'Fixture' || match.status_id === 1 || match.time?.status === 'Scheduled') {
          return 'UPCOMING';
        } else {
          return 'FINISHED';
        }
    }
  };

  const matchType = getMatchType();

  const getStatusColor = (type) => {
    switch (type) {
      case 'LIVE':
        return 'text-red-500';
      case 'UPCOMING':
        return 'text-blue-500';
      case 'FINISHED':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBg = (type) => {
    switch (type) {
      case 'LIVE':
        return 'bg-red-50';
      case 'UPCOMING':
        return 'bg-blue-50';
      case 'FINISHED':
        return 'bg-gray-100';
      default:
        return 'bg-gray-100';
    }
  };

  // Extract team data with fallbacks
  const team1Code = match.localteam?.code || 'T1';
  const team2Code = match.visitorteam?.code || 'T2';
  const team1Name = match.localteam?.name || 'Team A';
  const team2Name = match.visitorteam?.name || 'Team B';
  const team1Flag = match.localteam?.image_path || `https://via.placeholder.com/60.png?text=${team1Code}`;
  const team2Flag = match.visitorteam?.image_path || `https://via.placeholder.com/60.png?text=${team2Code}`;
  
  // Format match date and time
  const matchDate = match.starting_at ? new Date(match.starting_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  }) : '';
  
  const matchTime = match.starting_at ? new Date(match.starting_at).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }) : '';

  // Get scores if available
  const team1Score = match.runs?.find(run => run.team_id === match.localteam_id)?.score || '';
  const team2Score = match.runs?.find(run => run.team_id === match.visitorteam_id)?.score || '';

  return (
    <Link to={`/match/${match.id}`} className="block">
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 w-full max-w-xs sm:max-w-md mx-auto font-open-sans break-words hover:shadow-xl transition-shadow duration-200">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${getStatusColor(matchType)} ${getStatusBg(matchType)} leading-tight`}>
            {matchType}
          </span>
          <span className="text-xs text-gray-600">●</span>
          <span className="text-xs text-gray-600 font-medium flex-1 leading-tight">
            {match.league?.name || 'Cricket Match'}
          </span>
        </div>

        {/* Match Details */}
        <div className="mb-2">
          <div className="flex items-center gap-1 text-xs text-gray-600 mb-1 flex-wrap">
            <span className="font-medium leading-tight">{match.round || match.stage || 'Match'}</span>
            <span className="text-red-500 text-xs">📍</span>
            <span className="leading-tight">{match.venue?.name || 'TBD'}</span>
          </div>
        </div>

        {/* Teams */}
        <div className="space-y-2 mb-3">
          {/* Team 1 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <img
                src={team1Flag}
                alt={team1Name}
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover flex-shrink-0"
              />
              <span className="font-bold text-gray-800 text-sm sm:text-base leading-tight">
                {team1Name}
              </span>
            </div>
            {team1Score && (
              <span className="text-sm font-mono text-gray-700 whitespace-nowrap ml-2">
                {team1Score}
              </span>
            )}
          </div>

          {/* Team 2 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <img
                src={team2Flag}
                alt={team2Name}
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover flex-shrink-0"
              />
              <span className="font-bold text-gray-800 text-sm sm:text-base leading-tight">
                {team2Name}
              </span>
            </div>
            {team2Score ? (
              <span className="text-sm font-mono text-gray-700 whitespace-nowrap ml-2">
                {team2Score}
              </span>
            ) : matchType === 'UPCOMING' && (
              <span className="text-xs text-gray-500 italic whitespace-nowrap">Yet to bat</span>
            )}
          </div>

          {/* Upcoming Match Time */}
          {matchType === 'UPCOMING' && matchDate && matchTime && (
            <div className="flex justify-end pt-1 mt-1">
              <div className="text-right leading-tight">
                <div className="text-xs sm:text-sm text-gray-800 font-medium">{matchDate}</div>
                <div className="text-sm sm:text-base font-bold text-gray-800">{matchTime}</div>
              </div>
            </div>
          )}
        </div>

        {/* Result/Status */}
        <div className="text-center py-2 bg-gray-50 rounded-lg mb-3 leading-tight">
          <span className="text-xs sm:text-sm text-gray-600 font-medium">
            {match.note || match.status || 'Match Details'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-1 sm:gap-2 text-xs">
          <button className="flex-1 py-1 text-gray-600 hover:text-gray-800 font-medium leading-tight">
            Schedule
          </button>
          <button className="flex-1 py-1 text-gray-600 hover:text-gray-800 font-medium leading-tight">
            Report
          </button>
          <button className="flex-1 py-1 text-gray-600 hover:text-gray-800 font-medium leading-tight">
            Series
          </button>
        </div>
      </div>
    </Link>
  );
}

export default MatchCard;