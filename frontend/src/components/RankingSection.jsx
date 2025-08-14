import React, { useState, useEffect } from 'react';
import { fetchTopPlayers } from '../utils/api';

function RankingsSection() {
  const [players, setPlayers] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Test');
  const [activeType, setActiveType] = useState('Player Ranking');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPlayers = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchTopPlayers();
        // Map and limit to top 5 players, using order as rank
        const mappedPlayers = data.slice(0, 5).map((player, index) => ({
          id: player.id,
          name: player.fullname || 'Unknown Player',
          country: player.country?.name || 'Unknown',
          image: player.image_path || 'https://via.placeholder.com/100',
          // No points available; using order as rank
        }));
        setPlayers(mappedPlayers);
      } catch (err) {
        console.error('Error fetching players:', err);
        setError('Failed to load rankings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    loadPlayers();
  }, [activeCategory, activeType]); // Re-fetch if filters change (though data might not change)

  const categories = ['Test', 'ODI', 'T20I'];
  const types = ['Player Ranking', 'Team Ranking'];

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <section className="bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Cricket Ranking</h2>
          <p className="text-gray-600 text-sm">
            Lorem ipsum dolor sit amet consectetur. Nibh id venenatis elit quam posuere vitae aliquam. Velit odio mi
            duis proin quam eget. Sit vitae sit commodo id sagittis quam lacinia tortor augue. Pellentesque et tellus.
          </p>
        </div>
        <div className="flex justify-center space-x-4 mb-6 flex-wrap">
          <button
            onClick={() => setActiveType('Player Ranking')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
              activeType === 'Player Ranking' ? 'bg-red-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Player Ranking
          </button>
          <button
            onClick={() => setActiveType('Team Ranking')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
              activeType === 'Team Ranking' ? 'bg-red-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Team Ranking
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
                activeCategory === category ? 'bg-red-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Batting', 'Bowling', 'All Rounder'].map(type => (
            <div key={type} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-red-500 font-semibold">{activeCategory} {type}</span>
                {players[0] && (
                  <img
                    src={players[0].image}
                    alt={players[0].name}
                    className="w-16 h-16 object-cover rounded-full"
                  />
                )}
              </div>
              <div className="space-y-2">
                {players.map((player, index) => (
                  <div key={player.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <span className={`w-5 h-5 rounded-full ${
                        index === 0 ? 'bg-gray-300' : index === 1 ? 'bg-green-500' : index === 2 ? 'bg-blue-500' : index === 3 ? 'bg-red-500' : 'bg-black'
                      }`}></span>
                      <img
                        src={`https://flagcdn.com/w20/${player.country.toLowerCase().split(' ').join('-')}.png`}
                        alt={player.country}
                        className="w-5 h-5"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/20'; }}
                      />
                      <span>{player.name}</span>
                    </div>
                    <span>{index + 1}</span> {/* Using position as rank since points are not available */}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default RankingsSection;