import React, { useState, useEffect, useMemo } from 'react';
import {
  fetchAllMatches,
  fetchLiveMatches,
  fetchUpcomingMatches,
  fetchPastMatches,
} from '../utils/api';
import MatchCardSkeleton from '../components/MatchCardSkeleton';

const LEAGUE_LOGOS = {
  'The Hundred': '/th.png',
  'The Women\'s Hundred': '/thw.jpeg',
  'IPL': '/TL.png',
  'Big Bash League': '/bb.jpg',
  'The Ashes': '/rw.png',
  'ICC World Cup': '/icc.jpg',
  'PSL': '/rw.png',
  'Test Series': '/test.jpg',
  'Super Smash': '/ss.png',
  'Royal London One-Day Cup': '/rw.jpg',
  'T20 Blast': '/t20.jpg',
  'CPL': '/cpl.png',
  default: '/icc.jpg'
};

// Custom Select Component
function CustomSelect({ value, onChange, options, placeholder, icon }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-sm hover:border-gray-400 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon && <span className="text-gray-400">{icon}</span>}
            <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
          <svg
            className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-3 hover:bg-red-50 flex items-center gap-2 transition-colors ${
                option.value === value ? 'bg-red-50 text-red-600' : 'text-gray-900'
              }`}
            >
              {option.icon && <span>{option.icon}</span>}
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// League Details Modal
function LeagueDetailsModal({ league, isOpen, onClose }) {
  if (!isOpen || !league) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75">
      <div className="flex min-h-screen items-center justify-center p-4 sm:p-0">
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md sm:max-w-lg p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <img
                src={LEAGUE_LOGOS[league.name] || LEAGUE_LOGOS.default}
                alt={league.name}
                className="w-12 h-12 object-contain"
                onError={(e) => (e.target.src = LEAGUE_LOGOS.default)}
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{league.name}</h3>
                <p className="text-sm text-gray-600">{league.country || 'International'}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">League Details</h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">ID:</span>
                  <span className="text-sm text-gray-900">{league.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Type:</span>
                  <span className="text-sm text-gray-900">{league.type || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Country:</span>
                  <span className="text-sm text-gray-900">{league.country || 'International'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Active Matches:</span>
                  <span className="text-sm text-gray-900">{league.matchCount || 0}</span>
                </div>
                {league.coverage && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Coverage:</span>
                    <span className="text-sm text-gray-900">{league.coverage.status || 'N/A'}</span>
                  </div>
                )}
              </div>
            </div>
            
            {league.seasons && league.seasons.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Seasons</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {league.seasons.map((season) => (
                    <div key={season.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-900">{season.name}</span>
                        <span className="text-xs text-gray-600">{season.year || 'N/A'}</span>
                      </div>
                      {season.updated_at && (
                        <div className="text-xs text-gray-500 mt-1">
                          Last Updated: {new Date(season.updated_at).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-6 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
            <a
              href={`/league/${league.id}`}
              className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-center"
            >
              View League
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function FixturesPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded mb-6 w-96"></div>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-lg border p-4">
                    <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full lg:w-80">
              <div className="bg-white rounded-lg border p-4">
                <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                      </div>
                    </div>
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

function FixturesPage() {
  const [matches, setMatches] = useState({
    live: [],
    upcoming: [],
    finished: [],
    all: [],
  });
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formatFilter, setFormatFilter] = useState('');
  const [leagueFilter, setLeagueFilter] = useState('');
  const [teamFilter, setTeamFilter] = useState('');
  const [activeSection, setActiveSection] = useState('live');
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [isLeagueModalOpen, setIsLeagueModalOpen] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Fetch leagues from API
  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const response = await fetch('/api/leagues');
        const leaguesData = await response.json();
        setLeagues(Array.isArray(leaguesData) ? leaguesData : []);
      } catch (error) {
        console.error('Error fetching leagues:', error);
      }
    };

    fetchLeagues();
  }, []);

  // Extract teams from actual data
  const teams = useMemo(() => {
    const unique = new Set(
      matches.all.flatMap((m) => [m.localteam?.name, m.visitorteam?.name]).filter(Boolean)
    );
    return [...unique].sort();
  }, [matches.all]);

  // Create filter options
  const formatOptions = [
    { value: '', label: 'All Formats', icon: '🏏' },
    { value: 'T20', label: 'T20', icon: '⚡' },
    { value: 'T20I', label: 'T20I', icon: '⚡' },
    { value: 'ODI', label: 'ODI', icon: '🔵' },
    { value: 'Test', label: 'Test', icon: '🔴' },
    { value: 'T10', label: 'T10', icon: '💨' },
    { value: 'List A', label: 'List A', icon: '📋' },
  ];

  const leagueOptions = [
    { value: '', label: 'All Leagues', icon: '🌍' },
    ...leagues.map(league => ({
      value: league.name,
      label: league.name,
      icon: '🏆',
      data: league
    }))
  ];

  const teamOptions = [
    { value: '', label: 'All Teams', icon: '👥' },
    ...teams.map(team => ({
      value: team,
      label: team,
      icon: '🏏'
    }))
  ];

  // Filtered matches
  const filteredLive = useMemo(() => {
    return matches.live.filter((match) => {
      return (
        (!formatFilter || match.type === formatFilter) &&
        (!leagueFilter || match.league?.name === leagueFilter) &&
        (!teamFilter ||
          match.localteam?.name === teamFilter ||
          match.visitorteam?.name === teamFilter)
      );
    });
  }, [matches.live, formatFilter, leagueFilter, teamFilter]);

  const filteredUpcoming = useMemo(() => {
    return matches.upcoming
      .filter((m) => m.status === 'Fixture')
      .filter((match) => {
        return (
          (!formatFilter || match.type === formatFilter) &&
          (!leagueFilter || match.league?.name === leagueFilter) &&
          (!teamFilter ||
            match.localteam?.name === teamFilter ||
            match.visitorteam?.name === teamFilter)
        );
      });
  }, [matches.upcoming, formatFilter, leagueFilter, teamFilter]);

  const filteredFinished = useMemo(() => {
    return matches.finished.filter((match) => {
      return (
        (!formatFilter || match.type === formatFilter) &&
        (!leagueFilter || match.league?.name === leagueFilter) &&
        (!teamFilter ||
          match.localteam?.name === teamFilter ||
          match.visitorteam?.name === teamFilter)
      );
    });
  }, [matches.finished, formatFilter, leagueFilter, teamFilter]);

  // Data fetching
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [live, upcoming, finished, all] = await Promise.all([
          fetchLiveMatches(),
          fetchUpcomingMatches(),
          fetchPastMatches(),
          fetchAllMatches(),
        ]);

        setMatches({
          live: Array.isArray(live) ? live : [],
          upcoming: Array.isArray(upcoming) ? upcoming : [],
          finished: Array.isArray(finished) ? finished : [],
          all: Array.isArray(all) ? all : [],
        });
      } catch (err) {
        setError('Failed to load fixtures.');
        console.error('Error loading fixtures:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: '2-digit',
      month: 'short'
    });
  };

  const getMatchScore = (match) => {
    if (match.runs && match.runs.length > 0) {
      const localScore = match.runs.find(r => r.team_id === match.localteam_id);
      const visitorScore = match.runs.find(r => r.team_id === match.visitorteam_id);
      
      if (localScore && visitorScore) {
        return {
          local: `${localScore.score || 0}/${localScore.wickets || 0} (${localScore.overs || 0})`,
          visitor: `${visitorScore.score || 0}/${visitorScore.wickets || 0} (${visitorScore.overs || 0})`
        };
      }
    }
    
    return {
      local: match.note || 'N/A',
      visitor: match.note || 'N/A'
    };
  };

  const getTeamFlag = (teamName) => {
    const flagMap = {
      'Australia': '🇦🇺',
      'India': '🇮🇳',
      'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      'Pakistan': '🇵🇰',
      'South Africa': '🇿🇦',
      'New Zealand': '🇳🇿',
      'Sri Lanka': '🇱🇰',
      'Bangladesh': '🇧🇩',
      'West Indies': '🏴‍☠️',
      'Afghanistan': '🇦🇫'
    };
    
    for (const [country, flag] of Object.entries(flagMap)) {
      if (teamName?.includes(country)) {
        return flag;
      }
    }
    return '🏏';
  };

  const handleLeagueClick = (league) => {
    const leagueData = {
      ...league,
      matchCount: matches.all.filter(m => m.league?.name === league.name).length
    };
    setSelectedLeague(leagueData);
    setIsLeagueModalOpen(true);
  };

  const renderMatchCard = (match) => {
    const scores = getMatchScore(match);
    const isLive = match.status === 'Started' || match.status === 'Live';
    
    return (
      <div key={match.id} className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-4 hover:shadow-md transition-shadow">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-4 mb-3">
          <div className="text-sm text-gray-600">
            {formatDate(match.starting_at)}
          </div>
          <div className="text-sm text-gray-600 text-right max-w-full truncate">
            {match.note || `${match.type || 'Match'} - ${match.venue?.name || 'TBD'}`}
          </div>
          {isLive && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
              LIVE
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
          <div className="flex items-center gap-2 sm:gap-3 flex-1">
            <span className="text-xl sm:text-2xl">{getTeamFlag(match.localteam?.name)}</span>
            <div className="min-w-0">
              <div className="font-semibold text-gray-900 text-sm sm:text-base truncate">{match.localteam?.name || 'Team A'}</div>
              <div className="text-xs sm:text-sm text-gray-600">{scores.local}</div>
            </div>
          </div>
          
          <div className="text-center mx-2 sm:mx-4 flex-shrink-0">
            <div className="text-xs text-gray-500 mb-1">vs</div>
            <img
              src="/vs.png"
              alt="vs"
              className="w-4 h-4 sm:w-5 sm:h-5 mx-auto"
              onError={(e) => {e.target.style.display = 'none'}}
            />
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end">
            <div className="text-right min-w-0">
              <div className="font-semibold text-gray-900 text-sm sm:text-base truncate">{match.visitorteam?.name || 'Team B'}</div>
              <div className="text-xs sm:text-sm text-gray-600">{scores.visitor}</div>
            </div>
            <span className="text-xl sm:text-2xl">{getTeamFlag(match.visitorteam?.name)}</span>
          </div>
        </div>

        {match.status === 'Finished' && match.winner_team_id && (
          <div className="mb-3">
            <div className="text-sm font-medium text-green-600">
              {match.winner_team_id === match.localteam_id 
                ? `${match.localteam?.name} won` 
                : `${match.visitorteam?.name} won`}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <img
              src={LEAGUE_LOGOS[match.league?.name] || LEAGUE_LOGOS.default}
              alt={match.league?.name || 'League'}
              className="w-5 h-5 object-contain flex-shrink-0"
              onError={(e) => (e.target.src = LEAGUE_LOGOS.default)}
            />
            <span className="truncate">{match.league?.name || 'Unknown League'}</span>
          </div>
          <div className="flex gap-2">
            <a
              href={`/match/${match.id}/summary`}
              className="text-sm text-gray-600 hover:text-red-600 border-r pr-2"
            >
              Summary
            </a>
            <a
              href={`/match/${match.id}`}
              className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
            >
              View
            </a>
          </div>
        </div>
      </div>
    );
  };

  const getCurrentMatches = () => {
    switch (activeSection) {
      case 'live':
        return filteredLive;
      case 'upcoming':
        return filteredUpcoming;
      case 'finished':
        return filteredFinished;
      default:
        return [];
    }
  };

  const renderFilters = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Filter Matches</h3>
        <button
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          className="lg:hidden text-gray-600 hover:text-red-600"
        >
          <svg className={`h-5 w-5 transition-transform ${isMobileFiltersOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${isMobileFiltersOpen ? 'block' : 'hidden lg:grid'}`}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
          <CustomSelect
            value={formatFilter}
            onChange={setFormatFilter}
            options={formatOptions}
            placeholder="Select format"
            icon="🏏"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">League</label>
          <CustomSelect
            value={leagueFilter}
            onChange={setLeagueFilter}
            options={leagueOptions}
            placeholder="Select league"
            icon="🏆"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Team</label>
          <CustomSelect
            value={teamFilter}
            onChange={setTeamFilter}
            options={teamOptions}
            placeholder="Select team"
            icon="👥"
          />
        </div>
      </div>
    </div>
  );

  const renderSidebar = () => (
    <div className="w-full lg:w-80 space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Match Statistics</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-red-600">{matches.live.length}</div>
            <div className="text-sm text-gray-600">Live</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">{matches.upcoming.length}</div>
            <div className="text-sm text-gray-600">Upcoming</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{matches.finished.length}</div>
            <div className="text-sm text-gray-600">Finished</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Active Leagues</h3>
        <div className="space-y-3">
          {leagues.slice(0, 6).map((league) => {
            const matchCount = matches.all.filter(m => m.league?.name === league.name).length;
            return (
              <div key={league.id} className="group">
                <button
                  onClick={() => handleLeagueClick(league)}
                  className="w-full flex justify-between items-center text-sm p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={LEAGUE_LOGOS[league.name] || LEAGUE_LOGOS.default}
                      alt={league.name}
                      className="w-5 h-5 object-contain flex-shrink-0"
                      onError={(e) => (e.target.src = LEAGUE_LOGOS.default)}
                    />
                    <span className="text-gray-700 truncate group-hover:text-red-600">{league.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{matchCount}</span>
                    <svg className="h-4 w-4 text-gray-400 group-hover:text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
        {leagues.length > 6 && (
          <div className="mt-4 text-center">
            <a href="/leagues" className="text-red-600 text-sm hover:underline">
              View all leagues ({leagues.length})
            </a>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) return <FixturesPageSkeleton />;
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <p className="text-red-600 font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <meta name="description" content="Live, upcoming, and recent cricket matches. Real-time scores, schedules, and results." />
      <meta name="keywords" content="cricket, live scores, fixtures, match schedule, ODI, T20, IPL, World Cup" />
      <meta name="robots" content="index, follow" />
      <title>Cricket Hub - Live & Upcoming Matches</title>

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <a href="/" className="hover:text-red-600">Home</a>
            <span>›</span>
            <span className="text-gray-900">Cricket Fixtures</span>
          </nav>
        </div>
      </div>

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:justify-between items-start">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Cricket Fixtures</h1>
              <p className="text-gray-600 mb-4">Stay updated with real-time scores and upcoming games.</p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <button
                  onClick={() => setActiveSection('live')}
                  className={`font-medium pb-1 border-b-2 transition-colors ${
                    activeSection === 'live' 
                      ? 'text-red-600 border-red-600' 
                      : 'text-gray-600 border-transparent hover:text-red-600'
                  }`}
                >
                  🔴 Live Matches ({matches.live.length})
                </button>
                <button
                  onClick={() => setActiveSection('upcoming')}
                  className={`font-medium pb-1 border-b-2 transition-colors ${
                    activeSection === 'upcoming' 
                      ? 'text-red-600 border-red-600' 
                      : 'text-gray-600 border-transparent hover:text-red-600'
                  }`}
                >
                  📅 Upcoming ({matches.upcoming.length})
                </button>
                <button
                  onClick={() => setActiveSection('finished')}
                  className={`font-medium pb-1 border-b-2 transition-colors ${
                    activeSection === 'finished' 
                      ? 'text-red-600 border-red-600' 
                      : 'text-gray-600 border-transparent hover:text-red-600'
                  }`}
                >
                  ✅ Finished ({matches.finished.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            {renderFilters()}
            
            <div className="mb-6">
              {getCurrentMatches().length > 0 ? (
                getCurrentMatches().map(renderMatchCard)
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                  <div className="text-gray-400 text-6xl mb-4">🏏</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No matches found</h3>
                  <p className="text-gray-600">
                    {formatFilter || leagueFilter || teamFilter 
                      ? 'Try adjusting your filters to see more matches.'
                      : 'No matches are currently available in this section.'}
                  </p>
                  {(formatFilter || leagueFilter || teamFilter) && (
                    <button
                      onClick={() => {
                        setFormatFilter('');
                        setLeagueFilter('');
                        setTeamFilter('');
                      }}
                      className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="w-full lg:w-80">
            {renderSidebar()}
          </div>
        </div>
      </div>

      <LeagueDetailsModal
        league={selectedLeague}
        isOpen={isLeagueModalOpen}
        onClose={() => setIsLeagueModalOpen(false)}
      />
    </div>
  );
}

export default FixturesPage;