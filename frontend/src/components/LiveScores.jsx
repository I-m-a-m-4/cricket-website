import React from 'react';
import { Link } from 'react-router-dom';

function LiveScores({ matches }) {
  if (!matches || matches.length === 0) {
    return <p className="text-center text-gray-500">No live matches currently.</p>;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {matches.map(match => (
        <div key={match.id} className="bg-light-bg rounded-lg shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
          <div>
            <h3 className="font-cab font-bold text-xl text-dark-bg">{match.team1} vs {match.team2}</h3>
            <p className="text-sm text-gray-600 mt-3">Score: <span className="font-bold text-primary">{match.score}</span></p>
            <p className="text-sm text-gray-600">Overs: {match.overs}</p>
          </div>
          <Link to={`/match/${match.id}`} className="mt-4 text-center bg-primary text-white py-2 px-4 rounded-full font-cab font-bold hover:bg-[#E05E1A] transition-colors">
            View Details
          </Link>
        </div>
      ))}
    </div>
  );
}

export default LiveScores;