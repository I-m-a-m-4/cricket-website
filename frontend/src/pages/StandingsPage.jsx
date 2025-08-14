import React, { useState, useEffect } from 'react';

function StandingsPage() {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Placeholder for your API call to get standings data
    // e.g., fetchStandings().then(data => setStandings(data));
    const mockStandings = [
      { team: "Team A", played: 10, won: 8, lost: 2, points: 16 },
      { team: "Team B", played: 10, won: 6, lost: 4, points: 12 },
      { team: "Team C", played: 10, won: 5, lost: 5, points: 10 },
      { team: "Team D", played: 10, won: 2, lost: 8, points: 4 },
    ];
    
    setTimeout(() => {
      setStandings(mockStandings);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <div className="text-center mt-20 text-primary font-open-sans">Loading standings...</div>;
  }

  return (
    <div className="container mx-auto p-4 font-open-sans">
      <h1 className="text-4xl font-extrabold font-cab text-dark-bg text-center my-8">
        Tournament Standings
      </h1>
      <div className="bg-light-bg rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-dark-bg text-light-bg font-cab font-bold">
              <th className="px-4 py-2 text-left">Team</th>
              <th className="px-4 py-2">Played</th>
              <th className="px-4 py-2">Won</th>
              <th className="px-4 py-2">Lost</th>
              <th className="px-4 py-2">Points</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((team, index) => (
              <tr key={index} className="border-t border-subtle-gray hover:bg-gray-100">
                <td className="px-4 py-2 font-cab font-bold text-dark-bg">{team.team}</td>
                <td className="px-4 py-2 text-center text-gray-800">{team.played}</td>
                <td className="px-4 py-2 text-center text-gray-800">{team.won}</td>
                <td className="px-4 py-2 text-center text-gray-800">{team.lost}</td>
                <td className="px-4 py-2 text-center text-primary font-bold">{team.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StandingsPage;