import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { UsersIcon, UserIcon, StarIcon, ArrowLeftIcon, CrownIcon } from 'lucide-react';

const BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3001/api' 
  : 'https://cricket-api-xieo.onrender.com/api';

const SeriesSquadsPage = () => {
  const { seasonId } = useParams();
  const [season, setSeason] = useState(null);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    const fetchSeasonData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${BASE_URL}/seasons/${seasonId}?include=league,teams.squad.player,teams.coach`
        );
        const seasonData = response.data.data;
        setSeason(seasonData);
        setTeams(seasonData.teams || []);
        if (seasonData.teams?.length > 0) {
          setSelectedTeam(seasonData.teams[0]);
        }
      } catch (err) {
        setError('Failed to load squads');
        console.error('Error fetching season squads:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeasonData();
  }, [seasonId]);

  const getTeamLogo = (teamName) => {
    const teamLogos = {
      'australia': '🇦🇺',
      'india': '🇮🇳',
      'england': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      'south africa': '🇿🇦',
      'new zealand': '🇳🇿',
      'pakistan': '🇵🇰',
      'sri lanka': '🇱🇰',
      'bangladesh': '🇧🇩',
      'west indies': '🏴‍☠️',
      'afghanistan': '🇦🇫',
      'ireland': '🇮🇪',
      'scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    };

    const name = teamName?.toLowerCase() || '';
    for (const [country, flag] of Object.entries(teamLogos)) {
      if (name.includes(country)) return flag;
    }
    return '🏏';
  };

  const getPlayerRole = (position) => {
    const roleMap = {
      'batsman': 'Batsman',
      'bowler': 'Bowler',
      'all-rounder': 'All-rounder',
      'wicket-keeper': 'Wicket-keeper',
      'captain': 'Captain'
    };
    return roleMap[position?.toLowerCase()] || position || 'Player';
  };

  const getRoleIcon = (position) => {
    const pos = position?.toLowerCase() || '';
    if (pos.includes('captain')) return <CrownIcon className="w-4 h-4 text-yellow-500" />;
    if (pos.includes('wicket-keeper')) return <StarIcon className="w-4 h-4 text-blue-500" />;
    return <UserIcon className="w-4 h-4 text-gray-400" />;
  };

  const getRoleColor = (position) => {
    const pos = position?.toLowerCase() || '';
    if (pos.includes('captain')) return 'bg-yellow-100 text-yellow-800';
    if (pos.includes('wicket-keeper')) return 'bg-blue-100 text-blue-800';
    if (pos.includes('bowler')) return 'bg-red-100 text-red-800';
    if (pos.includes('all-rounder')) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 w-64 rounded mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                {Array(6).fill().map((_, i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
              <div className="lg:col-span-3">
                <div className="bg-white rounded-lg p-6">
                  <div className="h-32 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-4">
                    {Array(15).fill().map((_, i) => (
                      <div key={i} className="h-16 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <Link
            to="/series"
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Back to Series
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link
              to="/series"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{season?.name}</h1>
              <p className="text-gray-600">{season?.league?.name} - Team Squads</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Team Selection Sidebar */}
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <UsersIcon className="w-5 h-5 text-red-500" />
              Teams ({teams.length})
            </h3>
            {teams.map((team) => (
              <button
                key={team.id}
                onClick={() => setSelectedTeam(team)}
                className={`w-full text-left p-3 rounded-lg transition-colors flex items-center gap-3 ${
                  selectedTeam?.id === team.id
                    ? 'bg-red-500 text-white'
                    : 'bg-white hover:bg-gray-50 border'
                }`}
              >
                <div className="text-xl">
                  {getTeamLogo(team.name)}
                </div>
                <div>
                  <div className="font-medium">{team.name}</div>
                  <div className={`text-xs ${
                    selectedTeam?.id === team.id ? 'text-red-100' : 'text-gray-500'
                  }`}>
                    {team.squad?.length || 0} players
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Squad Details */}
          <div className="lg:col-span-3">
            {selectedTeam ? (
              <div className="bg-white rounded-lg shadow-sm border">
                {/* Team Header */}
                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-t-lg">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">
                      {getTeamLogo(selectedTeam.name)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{selectedTeam.name}</h2>
                      <p className="text-red-100">
                        {selectedTeam.squad?.length || 0} Players
                        {selectedTeam.coach && ` • Coach: ${selectedTeam.coach.name}`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Squad List */}
                <div className="p-6">
                  {selectedTeam.squad && selectedTeam.squad.length > 0 ? (
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-900 mb-4">Squad Members</h3>
                      {selectedTeam.squad.map((squadMember, index) => {
                        const player = squadMember.player;
                        return (
                          <div
                            key={player?.id || index}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <span className="text-red-600 font-bold">
                                  {player?.firstname?.[0]}{player?.lastname?.[0]}
                                </span>
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">
                                  {player?.fullname || `${player?.firstname || ''} ${player?.lastname || ''}`}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {player?.dateofbirth && `Age: ${new Date().getFullYear() - new Date(player.dateofbirth).getFullYear()}`}
                                  {player?.country && ` • ${player.country.name}`}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              {getRoleIcon(squadMember.position)}
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                getRoleColor(squadMember.position)
                              }`}>
                                {getPlayerRole(squadMember.position)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <UsersIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">No squad information available</p>
                    </div>
                  )}
                </div>

                {/* Team Stats Summary */}
                {selectedTeam.squad && selectedTeam.squad.length > 0 && (
                  <div className="border-t bg-gray-50 p-6 rounded-b-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">Squad Summary</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { 
                          label: 'Total Players', 
                          value: selectedTeam.squad.length,
                          color: 'text-blue-600'
                        },
                        {
                          label: 'Batsmen',
                          value: selectedTeam.squad.filter(p => 
                            p.position?.toLowerCase().includes('batsman')
                          ).length,
                          color: 'text-green-600'
                        },
                        {
                          label: 'Bowlers',
                          value: selectedTeam.squad.filter(p => 
                            p.position?.toLowerCase().includes('bowler')
                          ).length,
                          color: 'text-red-600'
                        },
                        {
                          label: 'All-rounders',
                          value: selectedTeam.squad.filter(p => 
                            p.position?.toLowerCase().includes('all-rounder')
                          ).length,
                          color: 'text-purple-600'
                        }
                      ].map((stat, index) => (
                        <div key={index} className="text-center">
                          <div className={`text-2xl font-bold ${stat.color}`}>
                            {stat.value}
                          </div>
                          <div className="text-sm text-gray-600">
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-12 text-center">
                <UsersIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Select a team to view squad</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeriesSquadsPage;