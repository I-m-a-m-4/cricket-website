import React from 'react';
import { Link } from 'react-router-dom';

function MatchSchedule({ matches }) {
  if (!matches || matches.length === 0) {
    return <p className="text-center text-gray-500">No upcoming matches scheduled.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {matches.map(match => (
        <div key={match.id} className="bg-light-bg rounded-lg shadow-md p-4 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
          <div>
            <h3 className="font-cab font-bold text-lg text-dark-bg">{match.team1} vs {match.team2}</h3>
            <p className="text-sm text-gray-600 mt-2">Date: <span className="font-bold">{match.date}</span></p>
          </div>
          <Link to={`/match/${match.id}`} className="mt-4 text-center bg-dark-bg text-white py-2 px-4 rounded-full hover:bg-gray-700 transition-colors">
            View Match
          </Link>
        </div>
      ))}
    </div>
  );
}

export default MatchSchedule;