import React, { useState, useEffect } from 'react';
import { fetchUpcomingMatches } from '../utils/api';

function MatchesSection() {
  const [matches, setMatches] = useState([]);
  const [activeTab, setActiveTab] = useState('Fixtures');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMatches = async () => {
      setLoading(true);
      try {
        const data = await fetchUpcomingMatches();
        setMatches(data.slice(0, 3)); // Limit to 3 matches
      } catch (err) {
        setError('Failed to load matches. Please check the server or API token.');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadMatches();
  }, []);

  const getTimeDifference = (dateStr) => {
    const now = new Date();
    const matchDate = new Date(dateStr);
    const diffTime = Math.ceil((matchDate - now) / (1000 * 60 * 60 * 24));
    return diffTime > 0 ? `${diffTime} days To go` : 'Live';
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <section className="bg-gray-50 py-6">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-4">
            <h2 className="text-2xl font-bold">Matches</h2>
            <button
              onClick={() => setActiveTab('Fixtures')}
              className={`px-4 py-2 rounded ${activeTab === 'Fixtures' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Fixtures
            </button>
            <button
              onClick={() => setActiveTab('Results')}
              className={`px-4 py-2 rounded ${activeTab === 'Results' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Results
            </button>
          </div>
          <a href="/all-matches" className="text-red-500 font-semibold">See All</a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {matches.map((match) => (
            <div key={match.id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-red-500 font-semibold">RESULT</span>
                <span className="text-gray-600">• {match.league?.name || 'Australia tour of India, 2023-24'}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <img src={match.localteam?.image_path || 'https://via.placeholder.com/30'} alt="Team Logo" className="w-6 h-6" />
                  <span>{match.localteam?.name || 'SA Cricket'}</span>
                </div>
                <span>vs</span>
                <div className="flex items-center space-x-2">
                  <img src={match.visitorteam?.image_path || 'https://via.placeholder.com/30'} alt="Team Logo" className="w-6 h-6" />
                  <span>{match.visitorteam?.name || 'Action Cricket'}</span>
                </div>
              </div>
              <div className="text-gray-600 mb-2">
                {match.starting_at ? new Date(match.starting_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' }) : '26 November, 2023 | 7:00 PM IST'}
              </div>
              <div className="text-gray-500 mb-2">{getTimeDifference(match.starting_at)}</div>
              <a href={`/match/${match.id}`} className="text-red-500 font-semibold">Match Info →</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default MatchesSection;