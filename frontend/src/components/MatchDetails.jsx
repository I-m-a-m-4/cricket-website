import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3001/api' 
  : 'https://cricket-api-xieo.onrender.com/api';

const fetchMatchDetails = async (matchId) => {
  try {
    const response = await axios.get(`${BASE_URL}/matches/${matchId}`, {
      timeout: 10000,
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch match details');
  }
};

const MatchDetails = () => {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getMatchDetails = async () => {
      try {
        const data = await fetchMatchDetails(id);
        setMatch(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    getMatchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-fixed bg-no-repeat" style={{ backgroundImage: `url(/stadrdium.jpg)` }}>
        <div className="min-h-screen bg-black bg-opacity-40 flex items-center justify-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white bg-opacity-15 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 animate-pulse border border-gray-200">
              <div className="h-10 bg-gray-300 rounded-lg w-3/4 mb-6 mx-auto"></div>
              <div className="space-y-6">
                <div className="h-6 bg-gray-300 rounded-lg w-3/4"></div>
                <div className="h-6 bg-gray-300 rounded-lg w-2/3"></div>
                <div className="h-6 bg-gray-300 rounded-lg w-2/3"></div>
                <div className="h-6 bg-gray-300 rounded-lg w-1/2"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-300 bg-opacity-15 rounded-xl p-6">
                    <div className="h-6 bg-gray-300 rounded w-1/2 mb-3"></div>
                    <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                  </div>
                  <div className="bg-gray-300 bg-opacity-15 rounded-xl p-6">
                    <div className="h-6 bg-gray-300 rounded w-1/2 mb-3"></div>
                    <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                  </div>
                </div>
                <div className="bg-gray-300 bg-opacity-15 rounded-xl p-6">
                  <div className="h-6 bg-gray-300 rounded w-1/2 mb-3"></div>
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-4 bg-gray-300 rounded w-full"></div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-300 bg-opacity-15 rounded-xl p-6">
                    <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
                    <table className="w-full table-auto">
                      <thead>
                        <tr className="border-b border-gray-300">
                          <th className="py-2 px-3"><div className="h-5 bg-gray-300 rounded w-10"></div></th>
                          <th className="py-2 px-3"><div className="h-5 bg-gray-300 rounded w-3/4"></div></th>
                          <th className="py-2 px-3"><div className="h-5 bg-gray-300 rounded w-6"></div></th>
                          <th className="py-2 px-3"><div className="h-5 bg-gray-300 rounded w-12"></div></th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...Array(11)].map((_, i) => (
                          <tr key={i} className="border-b border-gray-200">
                            <td className="py-2 px-3"><div className="w-10 h-10 bg-gray-300 rounded-full"></div></td>
                            <td className="py-2 px-3"><div className="h-5 bg-gray-300 rounded w-3/4"></div></td>
                            <td className="py-2 px-3"><div className="w-6 h-4 bg-gray-300 rounded"></div></td>
                            <td className="py-2 px-3"><div className="h-5 bg-gray-300 rounded w-12"></div></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-gray-300 bg-opacity-15 rounded-xl p-6">
                    <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
                    <table className="w-full table-auto">
                      <thead>
                        <tr className="border-b border-gray-300">
                          <th className="py-2 px-3"><div className="h-5 bg-gray-300 rounded w-10"></div></th>
                          <th className="py-2 px-3"><div className="h-5 bg-gray-300 rounded w-3/4"></div></th>
                          <th className="py-2 px-3"><div className="h-5 bg-gray-300 rounded w-6"></div></th>
                          <th className="py-2 px-3"><div className="h-5 bg-gray-300 rounded w-12"></div></th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...Array(11)].map((_, i) => (
                          <tr key={i} className="border-b border-gray-200">
                            <td className="py-2 px-3"><div className="w-10 h-10 bg-gray-300 rounded-full"></div></td>
                            <td className="py-2 px-3"><div className="h-5 bg-gray-300 rounded w-3/4"></div></td>
                            <td className="py-2 px-3"><div className="w-6 h-4 bg-gray-300 rounded"></div></td>
                            <td className="py-2 px-3"><div className="h-5 bg-gray-300 rounded w-12"></div></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-fixed bg-no-repeat" style={{ backgroundImage: `url(/stadium.jpg)` }}>
        <div className="min-h-screen bg-black bg-opacity-40 flex items-center justify-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white bg-opacity-15 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 text-center border border-gray-200">
              <p className="text-red-600 text-xl font-semibold">{error || 'Match not found'}</p>
              <Link to="/" className="mt-6 inline-block text-[#122e47] font-medium hover:text-blue-800 transition-colors duration-300">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const team1Name = match.localteam?.name || 'Team A';
  const team2Name = match.visitorteam?.name || 'Team B';
  const team1Score = match.localteam_dl_data?.score
    ? `${match.localteam_dl_data.score}/${match.localteam_dl_data.wickets_out} (${match.localteam_dl_data.overs} overs)`
    : match.runs?.find(r => r.team_id === match.localteam_id)
      ? `${match.runs.find(r => r.team_id === match.localteam_id).score}/${match.runs.find(r => r.team_id === match.localteam_id).wickets} (${match.runs.find(r => r.team_id === match.localteam_id).overs} overs)`
      : 'Yet to bat';
  const team2Score = match.visitorteam_dl_data?.score
    ? `${match.visitorteam_dl_data.score}/${match.visitorteam_dl_data.wickets_out} (${match.visitorteam_dl_data.overs} overs)`
    : match.runs?.find(r => r.team_id === match.visitorteam_id)
      ? `${match.runs.find(r => r.team_id === match.visitorteam_id).score}/${match.runs.find(r => r.team_id === match.visitorteam_id).wickets} (${match.runs.find(r => r.team_id === match.visitorteam_id).overs} overs)`
      : 'Yet to bat';

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed bg-no-repeat" style={{ backgroundImage: `url(/stadium.jpg)` }}>
      <div className="min-h-screen bg-black bg-opacity-40 flex flex-col">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            to="/"
            className="inline-block mb-6 text-[#122e47] font-semibold text-lg hover:text-blue-800 transition-colors duration-300"
          >
            ← Back to Home
          </Link>
          <div className="bg-white bg-opacity-15 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-200">
            <h1 className="text-3xl md:text-4xl font-extrabold text-black mb-6 tracking-tight">
              {team1Name} <span className="text-[#122e47]">vs</span> {team2Name}
            </h1>
            <div className="mb-8 space-y-3">
              <p className="text-lg text-gray-800">
                <span className="font-semibold text-black">League:</span> {match.league?.name || 'Cricket Match'}
              </p>
              <p className="text-lg text-gray-800">
                <span className="font-semibold text-black">Venue:</span> {match.venue?.name || 'TBD'}
              </p>
              <p className="text-lg text-gray-800">
                <span className="font-semibold text-black">Date:</span>{' '}
                {match.starting_at
                  ? new Date(match.starting_at).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'TBD'}
              </p>
              <p className="text-lg text-gray-800">
                <span className="font-semibold text-black">Status:</span> {match.status || 'Unknown'}
              </p>
              {match.note && (
                <p className="text-lg text-gray-800">
                  <span className="font-semibold text-black">Result:</span> {match.note}
                </p>
              )}
            </div>

            {/* Scoreboard */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-black mb-5">Scoreboard</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white bg-opacity-15 backdrop-blur-xl p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300 border border-gray-200">
                  <h3 className="text-xl font-semibold text-black mb-3">{team1Name}</h3>
                  <p className="text-lg text-gray-900">{team1Score}</p>
                </div>
                <div className="bg-white bg-opacity-15 backdrop-blur-xl p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300 border border-gray-200">
                  <h3 className="text-xl font-semibold text-black mb-3">{team2Name}</h3>
                  <p className="text-lg text-gray-900">{team2Score}</p>
                </div>
              </div>
              {match.balls?.length > 0 && (
                <div className="mt-6 bg-white bg-opacity-15 backdrop-blur-xl p-6 rounded-xl border border-gray-200">
                  <h4 className="text-lg font-semibold text-black mb-3">Recent Balls</h4>
                  <ul className="space-y-2 text-gray-900">
                    {match.balls.slice(0, 5).map((ball, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="inline-block w-3 h-3 bg-blue-600 rounded-full"></span>
                        Ball {ball.over}.{ball.ball}: {ball.comment || 'No comment'}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Lineup */}
            <div>
              <h2 className="text-2xl font-bold text-black mb-5">Lineup</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white bg-opacity-15 backdrop-blur-xl p-6 rounded-xl border border-gray-200">
                  <h3 className="text-xl font-semibold text-black mb-4">{team1Name}</h3>
                  <table className="w-full text-left text-gray-900 table-auto">
                    <thead>
                      <tr className="border-b border-gray-300">
                        <th className="py-2 px-3">Image</th>
                        <th className="py-2 px-3">Player</th>
                        <th className="py-2 px-3">Country</th>
                        <th className="py-2 px-3">Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {match.lineup
                        ?.filter((player) => player.lineup.team_id === match.localteam_id)
                        ?.map((player) => (
                          <tr
                            key={player.id}
                            className="border-b border-gray-200 hover:bg-gray-100 transition-colors duration-200"
                          >
                            <td className="py-2 px-3">
                              <img
                                src={player.image_path || `https://placehold.co/40x40?text=${player.fullname[0]}`}
                                alt={player.fullname}
                                className="w-10 h-10 rounded-full object-cover border-2 border-blue-600"
                              />
                            </td>
                            <td className="py-2 px-3">{player.fullname}</td>
                            <td className="py-2 px-3">
                              {player.country?.image_path ? (
                                <img
                                  src={player.country.image_path}
                                  alt={player.country.name || 'Unknown'}
                                  className="w-6 h-4 object-cover rounded"
                                  onError={(e) => (e.target.src = 'https://placehold.co/24x16?text=?')}
                                />
                              ) : (
                                <span className="text-gray-500">N/A</span>
                              )}
                            </td>
                            <td className="py-2 px-3">
                              {player.lineup.captain && <span className="text-[#122e47]">C</span>}
                              {player.lineup.wicketkeeper && <span className="text-[#122e47] ml-2">WK</span>}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                <div className="bg-white bg-opacity-15 backdrop-blur-xl p-6 rounded-xl border border-gray-200">
                  <h3 className="text-xl font-semibold text-black mb-4">{team2Name}</h3>
                  <table className="w-full text-left text-gray-900 table-auto">
                    <thead>
                      <tr className="border-b border-gray-300">
                        <th className="py-2 px-3">Image</th>
                        <th className="py-2 px-3">Player</th>
                        <th className="py-2 px-3">Country</th>
                        <th className="py-2 px-3">Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {match.lineup
                        ?.filter((player) => player.lineup.team_id === match.visitorteam_id)
                        ?.map((player) => (
                          <tr
                            key={player.id}
                            className="border-b border-gray-200 hover:bg-gray-100 transition-colors duration-200"
                          >
                            <td className="py-2 px-3">
                              <img
                                src={player.image_path || `https://placehold.co/40x40?text=${player.fullname[0]}`}
                                alt={player.fullname}
                                className="w-10 h-10 rounded-full object-cover border-2 border-blue-600"
                              />
                            </td>
                            <td className="py-2 px-3">{player.fullname}</td>
                            <td className="py-2 px-3">
                              {player.country?.image_path ? (
                                <img
                                  src={player.country.image_path}
                                  alt={player.country.name || 'Unknown'}
                                  className="w-6 h-4 object-cover rounded"
                                  onError={(e) => (e.target.src = 'https://placehold.co/24x16?text=?')}
                                />
                              ) : (
                                <span className="text-gray-500">N/A</span>
                              )}
                            </td>
                            <td className="py-2 px-3">
                              {player.lineup.captain && <span className="text-[#122e47]">C</span>}
                              {player.lineup.wicketkeeper && <span className="text-[#122e47] ml-2">WK</span>}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchDetails;