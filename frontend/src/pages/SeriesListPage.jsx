import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ChevronDownIcon, ChevronUpIcon, CalendarIcon, TrophyIcon } from 'lucide-react';

const BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3001/api' 
  : 'https://cricket-api-xieo.onrender.com/api';

const SeriesListPage = () => {
  const [seasons, setSeasons] = useState([]);
  const [filteredSeasons, setFilteredSeasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('current');
  const [expandedSeasons, setExpandedSeasons] = useState(new Set());
  const [seasonFixtures, setSeasonFixtures] = useState({});

  useEffect(() => {
    const fetchSeasons = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/seasons?include=league,fixtures,teams,standings`);
        const seasonsData = response.data.data || [];
        setSeasons(seasonsData);
        setFilteredSeasons(seasonsData);
      } catch (err) {
        setError('Failed to load seasons');
        console.error('Error fetching seasons:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSeasons();
  }, []);

  useEffect(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    let filtered = [];
    
    switch (activeFilter) {
      case 'current':
        filtered = seasons.filter(season => 
          season.year >= currentYear || 
          season.name?.toLowerCase().includes('2025') ||
          season.name?.toLowerCase().includes('current') ||
          season.is_active
        );
        break;
      case 'future':
        filtered = seasons.filter(season => 
          season.year > currentYear ||
          season.name?.toLowerCase().includes('future')
        );
        break;
      case 'concluded':
        filtered = seasons.filter(season => 
          season.year < currentYear ||
          season.name?.toLowerCase().includes('concluded') ||
          !season.is_active
        );
        break;
      default:
        filtered = seasons;
    }
    
    setFilteredSeasons(filtered);
  }, [seasons, activeFilter]);

  const fetchSeasonFixtures = async (seasonId) => {
    if (seasonFixtures[seasonId]) return;
    
    try {
      const response = await axios.get(`${BASE_URL}/seasons/${seasonId}?include=fixtures.localteam,fixtures.visitorteam,fixtures.venue,fixtures.stage`);
      const fixtures = response.data.data.fixtures || [];
      setSeasonFixtures(prev => ({
        ...prev,
        [seasonId]: fixtures
      }));
    } catch (err) {
      console.error('Error fetching season fixtures:', err);
      setSeasonFixtures(prev => ({
        ...prev,
        [seasonId]: []
      }));
    }
  };

  const toggleSeasonExpansion = async (seasonId) => {
    const newExpanded = new Set(expandedSeasons);
    if (newExpanded.has(seasonId)) {
      newExpanded.delete(seasonId);
    } else {
      newExpanded.add(seasonId);
      await fetchSeasonFixtures(seasonId);
    }
    setExpandedSeasons(newExpanded);
  };

  // Group seasons by their actual league names from SportMonk API
  const groupSeasonsByLeague = (seasons) => {
    const leagues = {};
    
    seasons.forEach(season => {
      const leagueName = season.league?.name || 'Other Cricket';
      
      if (!leagues[leagueName]) {
        leagues[leagueName] = [];
      }
      
      leagues[leagueName].push(season);
    });
    
    return leagues;
  };

  const getTeamLogo = (teamName) => {
    const teamLogos = {
      'australia': '🇦🇺', 'aus': '🇦🇺',
      'india': '🇮🇳', 'ind': '🇮🇳',
      'england': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'eng': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      'south africa': '🇿🇦', 'sa': '🇿🇦',
      'new zealand': '🇳🇿', 'nz': '🇳🇿',
      'pakistan': '🇵🇰', 'pak': '🇵🇰',
      'sri lanka': '🇱🇰', 'sl': '🇱🇰',
      'bangladesh': '🇧🇩', 'ban': '🇧🇩',
      'west indies': '🏴‍☠️', 'wi': '🏴‍☠️',
      'afghanistan': '🇦🇫', 'afg': '🇦🇫',
      'ireland': '🇮🇪', 'ire': '🇮🇪',
      'scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'sco': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
      'central stags': '🏏',
      'otago volts': '⚡',
      'wellington firebirds': '🔥',
      'auckland aces': '♠️',
      'canterbury kings': '👑',
      'northern brave': '⚔️'
    };

    const name = teamName?.toLowerCase() || '';
    for (const [team, logo] of Object.entries(teamLogos)) {
      if (name.includes(team)) return logo;
    }
    return '🏏';
  };

  const getLeagueIcon = (leagueName) => {
    const name = leagueName.toLowerCase();
    
    if (name.includes('hundred')) return '💯';
    if (name.includes('cpl')) return '🏆';
    if (name.includes('ipl')) return '🏏';
    if (name.includes('big bash')) return '⚡';
    if (name.includes('world cup')) return '🌍';
    if (name.includes('asia cup')) return '🏆';
    if (name.includes('t20')) return '⚡';
    
    return '🏏';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateRange = (season) => {
    const fixtures = season.fixtures || [];
    if (fixtures.length === 0) return 'TBD';
    
    const dates = fixtures
      .map(f => new Date(f.starting_at))
      .filter(d => !isNaN(d))
      .sort((a, b) => a - b);
    
    if (dates.length === 0) return 'TBD';
    
    const startDate = dates[0];
    const endDate = dates[dates.length - 1];
    
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  const getMatchStatus = (fixture) => {
    const statusMap = {
      'NS': 'Upcoming',
      'LIVE': 'Live', 
      'FT': 'Finished',
      '1st': 'Live',
      '2nd': 'Live',
      'HT': 'Half Time',
      'Postp.': 'Postponed'
    };
    
    return statusMap[fixture.status] || fixture.status || 'Unknown';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'LIVE':
      case 'Live': 
        return 'bg-green-500';
      case 'FT': 
      case 'Finished': 
        return 'bg-gray-500';
      case 'NS': 
      case 'Upcoming': 
        return 'bg-red-500';
      case 'Postponed':
        return 'bg-yellow-500';
      default: 
        return 'bg-gray-400';
    }
  };

  const LeagueSection = ({ leagueName, seasons }) => {
    return (
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 bg-gray-50 px-4 py-3 rounded-t-lg border border-b-0 flex items-center gap-3">
          <span className="text-xl">{getLeagueIcon(leagueName)}</span>
          {leagueName}
        </h2>
        
        <div className="bg-white border border-t-0 rounded-b-lg overflow-hidden">
          <table className="w-full">
            <tbody>
              {seasons.map((season, index) => {
                const isExpanded = expandedSeasons.has(season.id);
                const fixturesData = seasonFixtures[season.id] || season.fixtures || [];
                const fixturesCount = fixturesData.length;
                
                return (
                  <React.Fragment key={season.id}>
                    <tr className={`border-b border-gray-200 hover:bg-gray-50 ${index % 2 === 0 ? '' : 'bg-gray-25'}`}>
                      {/* Flags/Icon Column */}
                      <td className="w-16 px-4 py-3">
                        <div className="flex items-center gap-1">
                          <span className="text-lg">{getLeagueIcon(leagueName)}</span>
                        </div>
                      </td>
                      
                      {/* Series Name Column */}
                      <td className="px-4 py-3 flex-1">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleSeasonExpansion(season.id)}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            {isExpanded ? 
                              <ChevronUpIcon className="w-4 h-4 text-gray-500" /> : 
                              <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                            }
                          </button>
                          <Link 
                            to={`/series/${season.id}`}
                            className="text-red-600 hover:text-red-800 hover:underline font-medium"
                          >
                            {season.name}
                          </Link>
                        </div>
                      </td>
                      
                      {/* Date Range Column */}
                      <td className="px-4 py-3 text-gray-600 text-sm whitespace-nowrap">
                        {formatDateRange(season)}
                      </td>
                      
                      {/* Action Buttons Column */}
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Link
                            to={`/series/${season.id}/fixtures`}
                            className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded border transition-colors"
                          >
                            Fixtures & Results
                          </Link>
                          <Link
                            to={`/series/${season.id}/squads`}
                            className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border transition-colors"
                          >
                            Squads
                          </Link>
                          <Link
                            to={`/series/${season.id}/standings`}
                            className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border transition-colors"
                          >
                            Points Table
                          </Link>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Expanded Fixtures Row */}
                    {isExpanded && (
                      <tr>
                        <td colSpan="4" className="px-4 py-6 bg-gray-50 border-b">
                          <div className="bg-white rounded-lg p-4">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                <CalendarIcon className="w-5 h-5 text-red-500" />
                                Recent & Upcoming Matches
                                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                                  {fixturesCount} Matches
                                </span>
                              </h4>
                              <div className="flex gap-2">
                                <Link
                                  to={`/series/${season.id}/fixtures`}
                                  className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                                >
                                  Fixtures & Results
                                </Link>
                                <Link
                                  to={`/series/${season.id}/squads`}
                                  className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
                                >
                                  Squads
                                </Link>
                                <Link
                                  to={`/series/${season.id}/standings`}
                                  className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
                                >
                                  Points Table
                                </Link>
                              </div>
                            </div>
                            
                            {fixturesData.length > 0 ? (
                              <div className="space-y-3">
                                {fixturesData.slice(0, 5).map((fixture) => (
                                  <div key={fixture.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                      {/* Teams with Logos */}
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                          <div className="text-2xl">
                                            {getTeamLogo(fixture.localteam?.name)}
                                          </div>
                                          <div className="font-semibold text-gray-900 text-sm">
                                            {fixture.localteam?.name || 'TBD'}
                                          </div>
                                        </div>
                                        <div className="text-sm text-gray-500 font-medium">vs</div>
                                        <div className="flex items-center space-x-3">
                                          <div className="font-semibold text-gray-900 text-sm">
                                            {fixture.visitorteam?.name || 'TBD'}
                                          </div>
                                          <div className="text-2xl">
                                            {getTeamLogo(fixture.visitorteam?.name)}
                                          </div>
                                        </div>
                                      </div>
                                      
                                      {/* Match Details */}
                                      <div className="text-center text-sm text-gray-600">
                                        <div className="font-medium">
                                          {formatDate(fixture.starting_at)}
                                        </div>
                                        <div className="text-gray-500">
                                          {new Date(fixture.starting_at).toLocaleTimeString('en-US', {
                                            hour: 'numeric',
                                            minute: '2-digit',
                                            hour12: true
                                          })}
                                        </div>
                                        {fixture.venue?.name && (
                                          <div className="text-gray-500 mt-1">
                                            {fixture.venue.name}
                                          </div>
                                        )}
                                      </div>
                                      
                                      {/* Status */}
                                      <div className="text-center md:text-right">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${
                                          getStatusColor(fixture.status)
                                        }`}>
                                          {getMatchStatus(fixture)}
                                        </span>
                                        {fixture.stage?.name && (
                                          <div className="text-xs text-gray-500 mt-1">
                                            {fixture.stage.name}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                
                                {fixturesData.length > 5 && (
                                  <Link
                                    to={`/series/${season.id}/fixtures`}
                                    className="block text-center py-3 text-red-600 hover:text-red-800 font-medium text-sm bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                  >
                                    View All {fixturesData.length} Matches →
                                  </Link>
                                )}
                              </div>
                            ) : (
                              <div className="text-center py-8 text-gray-500">
                                <CalendarIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                <p>No fixtures available</p>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-3">
            <div className="h-4 bg-gray-200 w-48 rounded animate-pulse"></div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <div className="h-8 bg-gray-200 w-96 rounded mb-8 animate-pulse"></div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/4">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="h-6 bg-gray-200 w-20 rounded mb-4 animate-pulse"></div>
                <div className="space-y-3">
                  {Array(4).fill().map((_, i) => (
                    <div key={i} className="h-10 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="space-y-6">
                {Array(4).fill().map((_, i) => (
                  <div key={i} className="bg-white rounded-lg">
                    <div className="h-12 bg-gray-200 rounded-t-lg animate-pulse"></div>
                    <div className="p-4 space-y-3">
                      {Array(3).fill().map((_, j) => (
                        <div key={j} className="h-16 bg-gray-100 rounded animate-pulse"></div>
                      ))}
                    </div>
                  </div>
                ))}
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
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrophyIcon className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const leagueGroups = groupSeasonsByLeague(filteredSeasons);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <nav className="text-sm text-gray-600">
            <Link to="/" className="hover:text-red-600 transition-colors">Home</Link>
            <span className="mx-2 text-gray-400">›</span>
            <span className="text-gray-900 font-medium">Series</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          Cricket Fixtures - Domestic & International Cricket Series
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filter */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm sticky top-4">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter</h3>
                
                <div className="space-y-2">
                  <button
                    onClick={() => setActiveFilter('current')}
                    className={`w-full text-left px-4 py-2 rounded ${
                      activeFilter === 'current' 
                        ? 'bg-red-500 text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Current Cricket
                  </button>
                  <button
                    onClick={() => setActiveFilter('future')}
                    className={`w-full text-left px-4 py-2 rounded ${
                      activeFilter === 'future' 
                        ? 'bg-red-500 text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Future Series / Tournaments
                  </button>
                  <button
                    onClick={() => setActiveFilter('concluded')}
                    className={`w-full text-left px-4 py-2 rounded ${
                      activeFilter === 'concluded' 
                        ? 'bg-red-500 text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Recently Concluded
                  </button>
                </div>


              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {Object.keys(leagueGroups).length > 0 ? (
              Object.entries(leagueGroups).map(([leagueName, seasons]) => (
                <LeagueSection
                  key={leagueName}
                  leagueName={leagueName}
                  seasons={seasons}
                />
              ))
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrophyIcon className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-500 text-xl mb-4">No cricket series found for the selected filter.</p>
                <button 
                  onClick={() => setActiveFilter('current')}
                  className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                >
                  View Current Cricket
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeriesListPage;