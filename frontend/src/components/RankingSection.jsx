import React, { useState, useEffect } from 'react';
import { fetchTeamRankings } from '../utils/api';

function RankingsSection() {
  const [rankings, setRankings] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Test');
  const [activeType, setActiveType] = useState('Team Ranking');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRankings = async () => {
      setLoading(true);
      setError(null);
      try {
        if (activeType === 'Team Ranking') {
          const rankingsData = await fetchTeamRankings(activeCategory, 'men');
          setRankings(rankingsData); // Contains the top 5 teams directly
        } else {
          setRankings([]); // Reset rankings for Player Ranking
        }
      } catch (err) {
        console.error('Error fetching rankings:', err);
        setError('Failed to load rankings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadRankings();
  }, [activeCategory, activeType]);

  const categories = ['Test', 'ODI', 'T20I'];
  const types = ['Team Ranking', 'Player Ranking']; // Player Ranking last

  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;

  return (
    <section className="bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Cricket Ranking</h2>
          <p className="text-gray-600 text-sm max-w-2xl mx-auto">
            Official ICC team rankings across all formats of international cricket.
            Rankings are updated regularly based on team performance.
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
          {/* Type filters in one row (2 columns) on mobile, horizontal on md */}
          <div className="grid grid-cols-2 gap-2 md:flex md:space-x-2">
            {types.map(type => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 text-center ${
                  activeType === type 
                    ? 'bg-red-500 text-white shadow-md' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 hover:shadow-sm'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Category filters in one row (3 columns) on mobile, horizontal on md */}
          <div className="grid grid-cols-3 gap-2 md:flex md:space-x-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 text-center ${
                  activeCategory === category 
                    ? 'bg-red-500 text-white shadow-md' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 hover:shadow-sm'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-4 border border-gray-200 animate-pulse"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="h-6 bg-gray-300 rounded w-1/3"></span>
                  <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 bg-gray-300 rounded-full"></span>
                      <span className="h-6 bg-gray-300 rounded w-1/2"></span>
                    </div>
                    <span className="h-6 bg-gray-300 rounded w-1/4"></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : activeType === 'Team Ranking' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rankings.map((team, index) => (
              <div
                key={team.id}
                className="bg-white rounded-lg shadow-md p-4 border border-gray-200 transform hover:scale-105 transition-transform duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-red-500 font-semibold">
                    {index === 0 ? `${activeCategory} Team Ranking` : ''}
                  </span>
                  <img
                    src={team.image_path}
                    alt={team.name}
                    className="w-16 h-16 object-contain"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/64?text=FLAG';
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full text-xs font-medium">
                        {index + 1}
                      </span>
                      <span className="font-medium text-gray-800">{team.name}</span>
                    </div>
                    <span className="font-bold text-gray-700">
                      {team.rating || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-block">
              <div className="animate-pulse flex space-x-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="w-48 h-64 bg-gray-200 rounded-lg p-4">
                    <div className="w-16 h-16 bg-gray-300 rounded-full mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-1"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-gray-600">Player rankings are coming soon. Check back later!</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default RankingsSection;