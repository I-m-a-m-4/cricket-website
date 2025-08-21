import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';

function PlayerCareerStats() {
  const { isDarkMode } = useTheme();
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [careerStats, setCareerStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch top players for selection
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get('/api/players/top');
        setPlayers(response.data);
        if (response.data.length > 0) {
          setSelectedPlayer(response.data[0].id);
        }
      } catch (err) {
        setError('Failed to load players. Please try again.');
        console.error('Error fetching players:', err);
      }
    };
    fetchPlayers();
  }, []);

  // Fetch career stats for selected player
  useEffect(() => {
    if (!selectedPlayer) return;
    const fetchCareerStats = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/players/${selectedPlayer}`, {
          params: { include: 'career' }
        });
        setCareerStats(response.data.career?.data || []);
        setError(null);
      } catch (err) {
        setError('Failed to load career stats. Please try again.');
        console.error('Error fetching career stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCareerStats();
  }, [selectedPlayer]);

  // Filter players based on search query
  const filteredPlayers = players.filter(player =>
    player.fullname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`container mx-auto px-4 py-8 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} rounded-lg shadow-lg`}>
      <h1 className="text-3xl font-bold mb-6 text-center">Player Career Stats</h1>

      {/* Player Search and Selection */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search for a player..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full max-w-md mx-auto border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${
            isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'
          }`}
        />
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {filteredPlayers.map(player => (
            <button
              key={player.id}
              onClick={() => setSelectedPlayer(player.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedPlayer === player.id
                  ? 'bg-red-500 text-white shadow-lg'
                  : isDarkMode
                  ? 'bg-gray-800 text-white hover:bg-gray-700'
                  : 'bg-gray-200 text-gray-800 hover:bg-red-100'
              }`}
            >
              {player.fullname}
            </button>
          ))}
        </div>
      </div>

      {/* Error and Loading States */}
      {error && (
        <div className="text-center text-red-500 mb-4">{error}</div>
      )}
      {loading && (
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
        </div>
      )}

      {/* Career Stats Table */}
      {!loading && !error && selectedPlayer && careerStats.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                <th className="p-3 text-left text-sm font-semibold">Season</th>
                <th className="p-3 text-left text-sm font-semibold">Matches</th>
                <th className="p-3 text-left text-sm font-semibold">Runs</th>
                <th className="p-3 text-left text-sm font-semibold">Wickets</th>
                <th className="p-3 text-left text-sm font-semibold">Batting Avg</th>
                <th className="p-3 text-left text-sm font-semibold">Bowling Avg</th>
                <th className="p-3 text-left text-sm font-semibold">Strike Rate</th>
                <th className="p-3 text-left text-sm font-semibold">Economy</th>
              </tr>
            </thead>
            <tbody>
              {careerStats.map((stat, index) => (
                <tr
                  key={index}
                  className={`border-b ${isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-red-50'}`}
                >
                  <td className="p-3 text-sm">{stat.season?.name || 'N/A'}</td>
                  <td className="p-3 text-sm">{stat.matches || 0}</td>
                  <td className="p-3 text-sm">{stat.runs || 0}</td>
                  <td className="p-3 text-sm">{stat.wickets || 0}</td>
                  <td className="p-3 text-sm">{stat.batting_average || 'N/A'}</td>
                  <td className="p-3 text-sm">{stat.bowling_average || 'N/A'}</td>
                  <td className="p-3 text-sm">{stat.strike_rate || 'N/A'}</td>
                  <td className="p-3 text-sm">{stat.economy || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!loading && !error && (!selectedPlayer || careerStats.length === 0) && (
        <div className="text-center text-gray-500">No career stats available for selected player.</div>
      )}
    </div>
  );
}

export default PlayerCareerStats;