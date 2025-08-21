import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { CalendarIcon, ClockIcon, MapPinIcon, TrophyIcon, ArrowLeftIcon } from 'lucide-react';

const BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3001/api' 
  : 'https://cricket-api-xieo.onrender.com/api';

const SeriesFixturesPage = () => {
  const { seasonId } = useParams();
  const [season, setSeason] = useState(null);
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // all, upcoming, live, finished

  useEffect(() => {
    const fetchSeasonData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${BASE_URL}/seasons/${seasonId}?include=league,fixtures.localteam,fixtures.visitorteam,fixtures.venue,fixtures.stage,fixtures.runs,fixtures.wickets`
        );
        const seasonData = response.data.data;
        setSeason(seasonData);
        setFixtures(seasonData.fixtures || []);
      } catch (err) {
        setError('Failed to load fixtures');
        console.error('Error fetching season fixtures:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeasonData();
  }, [seasonId]);

  const getTeamLogo = (teamName) => {
    // Mock team logos - you can replace with actual team logo URLs
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
    return '🏏'; // Default cricket icon
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getMatchStatus = (fixture) => {
    const statusMap = {
      'NS': 'Upcoming',
      'LIVE': 'Live',
      'FT': 'Finished',
      '1st': 'Live',
      '2nd': 'Live',
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

  const filterFixtures = (fixtures, filter) => {
    switch (filter) {
      case 'upcoming':
        return fixtures.filter(f => ['NS'].includes(f.status));
      case 'live':
        return fixtures.filter(f => ['LIVE', '1st', '2nd'].includes(f.status));
      case 'finished':
        return fixtures.filter(f => ['FT'].includes(f.status));
      default:
        return fixtures;
    }
  };

  const filteredFixtures = filterFixtures(fixtures, activeTab);

  const getMatchResult = (fixture) => {
    // Mock match results - you'd get this from fixture data
    if (fixture.status === 'FT' && fixture.runs) {
      return `${fixture.localteam?.name} won by 5 wickets`;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 w-64 rounded mb-6"></div>
            <div className="space-y-4">
              {Array(8).fill().map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6">
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              ))}
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
              <p className="text-gray-600">{season?.league?.name}</p>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {[
              { key: 'all', label: 'All Matches' },
              { key: 'upcoming', label: 'Upcoming' },
              { key: 'live', label: 'Live' },
              { key: 'finished', label: 'Finished' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                  activeTab === tab.key
                    ? 'bg-red-500 text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Fixtures List */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          {filteredFixtures.length > 0 ? (
            filteredFixtures.map((fixture) => (
              <div key={fixture.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                    {/* Teams */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">
                            {getTeamLogo(fixture.localteam?.name)}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {fixture.localteam?.name || 'TBD'}
                            </div>
                            {fixture.runs?.localteam_runs && (
                              <div className="text-sm text-gray-600">
                                {fixture.runs.localteam_runs}/{fixture.wickets?.localteam_wickets || 0}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-lg font-bold text-gray-400">vs</div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">
                            {getTeamLogo(fixture.visitorteam?.name)}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {fixture.visitorteam?.name || 'TBD'}
                            </div>
                            {fixture.runs?.visitorteam_runs && (
                              <div className="text-sm text-gray-600">
                                {fixture.runs.visitorteam_runs}/{fixture.wickets?.visitorteam_wickets || 0}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Match Details */}
                    <div className="text-center space-y-2">
                      <div className="flex items-center justify-center space-x-2 text-gray-600">
                        <CalendarIcon className="w-4 h-4" />
                        <span className="font-medium">{formatDate(fixture.starting_at)}</span>
                      </div>
                      
                      <div className="flex items-center justify-center space-x-2 text-gray-600">
                        <ClockIcon className="w-4 h-4" />
                        <span>{formatTime(fixture.starting_at)}</span>
                      </div>
                      
                      {fixture.venue?.name && (
                        <div className="flex items-center justify-center space-x-2 text-gray-600">
                          <MapPinIcon className="w-4 h-4" />
                          <span className="text-sm">{fixture.venue.name}</span>
                        </div>
                      )}
                      
                      {fixture.stage?.name && (
                        <div className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full inline-block">
                          {fixture.stage.name}
                        </div>
                      )}
                    </div>
                    
                    {/* Status & Result */}
                    <div className="text-center lg:text-right space-y-2">
                      <div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${
                          getStatusColor(fixture.status)
                        }`}>
                          {getMatchStatus(fixture)}
                        </span>
                      </div>
                      
                      {getMatchResult(fixture) && (
                        <div className="text-sm font-medium text-green-600">
                          {getMatchResult(fixture)}
                        </div>
                      )}
                      
                      <Link
                        to={`/match/${fixture.id}`}
                        className="inline-block px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <TrophyIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No matches found for this filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeriesFixturesPage;