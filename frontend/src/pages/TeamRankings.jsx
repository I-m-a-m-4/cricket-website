import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';

function TeamRankings() {
  const { isDarkMode } = useTheme();
  const [rankings, setRankings] = useState([]);
  const [format, setFormat] = useState('TEST');
  const [gender, setGender] = useState('men');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formats = ['TEST', 'ODI', 'T20I'];
  const genders = ['men', 'women'];

  useEffect(() => {
    const fetchRankings = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/team-rankings/global', {
          params: { type: format, gender },
          timeout: 10000,
        });
        setRankings(response.data || []);
        setError(null);
      } catch (err) {
        setError('Failed to load team rankings. Please try again later.');
        console.error('Error fetching rankings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRankings();
  }, [format, gender]);

  const resetFilters = () => {
    setFormat('TEST');
    setGender('men');
  };

  return (
    <div className={`container mx-auto px-4 py-8 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} rounded-lg shadow-lg`}>
      <h1 className="text-3xl font-bold mb-6 text-center">Global Team Rankings</h1>
      
      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 max-w-2xl mx-auto">
        <div>
          <h2 className="text-sm font-medium mb-2">Format</h2>
          <div className="flex flex-wrap gap-2">
            {formats.map((fmt) => (
              <button
                key={fmt}
                onClick={() => setFormat(fmt)}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 group ${
                  format === fmt
                    ? 'bg-red-500 text-white shadow-lg'
                    : isDarkMode
                    ? 'bg-gray-800 text-white hover:bg-gray-700'
                    : 'bg-gray-200 text-gray-800 hover:bg-red-100'
                }`}
              >
                {fmt}
                <span className="absolute hidden group-hover:block -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2">
                  Select {fmt}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-sm font-medium mb-2">Gender</h2>
          <div className="flex flex-wrap gap-2">
            {genders.map((gnd) => (
              <button
                key={gnd}
                onClick={() => setGender(gnd)}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 group ${
                  gender === gnd
                    ? 'bg-red-500 text-white shadow-lg'
                    : isDarkMode
                    ? 'bg-gray-800 text-white hover:bg-gray-700'
                    : 'bg-gray-200 text-gray-800 hover:bg-red-100'
                }`}
              >
                {gnd.charAt(0).toUpperCase() + gnd.slice(1)}
                <span className="absolute hidden group-hover:block -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2">
                  Select {gnd.charAt(0).toUpperCase() + gnd.slice(1)}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="col-span-1 sm:col-span-2 text-center">
          <button
            onClick={resetFilters}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-red-100 text-red-800 hover:bg-red-200'
            }`}
          >
            Reset Filters
          </button>
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

      {/* Rankings Table */}
      {!loading && !error && rankings.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                <th className="p-3 text-left text-sm font-semibold">Rank</th>
                <th className="p-3 text-left text-sm font-semibold">Team</th>
                <th className="p-3 text-left text-sm font-semibold">Points</th>
                <th className="p-3 text-left text-sm font-semibold">Rating</th>
              </tr>
            </thead>
            <tbody>
              {rankings
                .find((r) => r.type === format && r.gender === gender)
                ?.teams.map((team, index) => (
                  <tr
                    key={team.id}
                    className={`border-b ${isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-red-50'}`}
                  >
                    <td className="p-3 text-sm">{index + 1}</td>
                    <td className="p-3 text-sm flex items-center">
                      <img src={team.image_path} alt={team.name} className="w-6 h-6 mr-2 rounded-full" onError={(e) => (e.target.src = 'https://via.placeholder.com/24')} />
                      {team.name} ({team.code})
                    </td>
                    <td className="p-3 text-sm">{team.points || 'N/A'}</td>
                    <td className="p-3 text-sm">{team.rating || 'N/A'}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
      {!loading && !error && (!rankings.length || !rankings.find((r) => r.type === format && r.gender === gender)) && (
        <div className="text-center text-gray-500">No rankings available for selected filters.</div>
      )}
    </div>
  );
}

export default TeamRankings;