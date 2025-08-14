import React, { useState, useEffect } from 'react';
import { fetchUpcomingMatches } from '../utils/api'; // Adjust the import path as needed

function MatchesSection() {
  const [matches, setMatches] = useState([]);
  const [activeTab, setActiveTab] = useState('Fixtures');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMatches = async () => {
      setLoading(true); // Ensure loading starts fresh
      setError(null); // Clear any previous errors
      try {
        const data = await fetchUpcomingMatches();
        if (data && data.length > 0) {
          setMatches(data.slice(0, 3)); // Only set matches if data is valid
        } else {
          // Do not set error here; keep loading true to show skeleton
          console.warn('No matches available, keeping skeleton animation.');
        }
      } catch (err) {
        setError('Failed to load matches due to a network or API issue.'); // Only set error for critical failures
        console.error('Fetch error:', err);
      } finally {
        // Only stop loading if we have matches or a critical error
        if (matches.length > 0 || error) {
          setLoading(false);
        }
      }
    };
    loadMatches();
  }, []); // Empty dependency array ensures this runs once on mount

  const getTimeDifference = (dateStr) => {
    const now = new Date();
    const matchDate = new Date(dateStr);
    const diffTime = Math.ceil((matchDate - now) / (1000 * 60 * 60 * 24));
    return diffTime > 0 ? `${diffTime} days To go` : 'Live';
  };

  // Show skeleton if loading or if no matches and no critical error
  if (loading || (matches.length === 0 && !error)) {
    return (
      <section className="bg-gray-50 py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-4">
              <h2 className="text-2xl font-bold">Matches</h2>
              <div className="px-4 py-2 rounded bg-gray-200 animate-pulse"></div>
              <div className="px-4 py-2 rounded bg-gray-200 animate-pulse"></div>
            </div>
            <div className="w-16 h-6 bg-gray-200 animate-pulse rounded"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md animate-pulse">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-16 h-4 bg-gray-200 rounded"></div>
                  <div className="w-32 h-4 bg-gray-200 rounded"></div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                    <div className="w-20 h-4 bg-gray-200 rounded"></div>
                  </div>
                  <div className="w-4 h-4 text-gray-500">vs</div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                    <div className="w-20 h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="w-28 h-4 bg-gray-200 rounded mb-2"></div>
                <div className="w-20 h-4 bg-gray-200 rounded mb-2"></div>
                <div className="w-24 h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <section className="bg-gray-500 py-6">
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
                  <img src={match.localteam?.image_path} alt="Team Logo" className="w-6 h-6" />
                  <span>{match.localteam?.name || 'SA Cricket'}</span>
                </div>
                <span>vs</span>
                <div className="flex items-center space-x-2">
                  <img src={match.visitorteam?.image_path} alt="Team Logo" className="w-6 h-6" />
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