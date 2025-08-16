import React from 'react';

function MatchPage() {
  const matchId = window.location.pathname.split('/match/')[1] || '3'; // Extract ID from URL
  const match = {
    id: matchId,
    localteam: { name: 'Team A' },
    visitorteam: { name: 'Team B' },
    score: '250/5',
    overs: '40.3',
    venue: 'Stadium XYZ',
    commentary: ['Ball 1: Four!', 'Ball 2: Wicket!'],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow bg-gradient-to-b from-gray-100 to-white py-10">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">
              {match.localteam.name} vs {match.visitorteam.name}
            </h1>
            <div className="space-y-4">
              <p className="text-lg text-gray-700 font-semibold">Score: {match.score}</p>
              <p className="text-md text-gray-600">Overs: {match.overs}</p>
              <p className="text-md text-gray-600">Venue: {match.venue}</p>
              <div className="mt-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Live Commentary</h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  {match.commentary.map((comment, index) => (
                    <li key={index}>{comment}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MatchPage;