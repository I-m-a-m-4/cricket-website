import React, { useState, useEffect, useMemo } from 'react';
import {
  fetchAllMatches,
  fetchLiveMatches,
  fetchUpcomingMatches,
  fetchPastMatches,
} from '../utils/api';
import MatchCard from '../components/MatchCard';
import MatchCardSkeleton from '../components/MatchCardSkeleton';

function FixturesPageSkeleton() {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="animate-pulse">
        <div className="h-10 bg-gray-300 rounded mb-8 w-48"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <MatchCardSkeleton key={i} />
          ))}
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔽 Filters (always declared — Hooks at top level)
  const [formatFilter, setFormatFilter] = useState('');
  const [leagueFilter, setLeagueFilter] = useState('');
  const [teamFilter, setTeamFilter] = useState('');

  // ✅ Always run: extract leagues and teams
  const leagues = useMemo(() => {
    const unique = new Set(
      matches.upcoming
        .filter((m) => m.status === 'Fixture')
        .map((m) => m.league?.name)
        .filter(Boolean)
    );
    return [...unique].sort();
  }, [matches.upcoming]);

  const teams = useMemo(() => {
    const unique = new Set(
      matches.upcoming
        .filter((m) => m.status === 'Fixture')
        .flatMap((m) => [m.localteam?.name, m.visitorteam?.name])
        .filter(Boolean)
    );
    return [...unique].sort();
  }, [matches.upcoming]);

  // ✅ Always run: filtered upcoming matches
  const filteredUpcoming = useMemo(() => {
    return matches.upcoming
      .filter((m) => m.status === 'Fixture') // Ensure only upcoming
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

  // 🔽 Data fetching
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

        // ✅ Ensure all are arrays
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

  // 🔽 Render section (now just a pure function, no Hooks)
  const renderSection = (title, matchList, id) => {
    if (!matchList || matchList.length === 0) return null;

    if (id === 'upcoming') {
      return (
        <section key={id} className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>

            <div className="flex flex-wrap gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                <select
                  value={formatFilter}
                  onChange={(e) => setFormatFilter(e.target.value)}
                  className="rounded-md border-gray-300 shadow-sm text-sm focus:border-red-500 focus:ring-red-500"
                >
                  <option value="">All Formats</option>
                  <option value="T20">T20</option>
                  <option value="ODI">ODI</option>
                  <option value="Test">Test</option>
                  <option value="T10">T10</option>
                  <option value="One-Day">One-Day</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">League</label>
                <select
                  value={leagueFilter}
                  onChange={(e) => setLeagueFilter(e.target.value)}
                  className="rounded-md border-gray-300 shadow-sm text-sm focus:border-red-500 focus:ring-red-500"
                >
                  <option value="">All Leagues</option>
                  {leagues.map((league) => (
                    <option key={league} value={league}>
                      {league}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Team</label>
                <select
                  value={teamFilter}
                  onChange={(e) => setTeamFilter(e.target.value)}
                  className="rounded-md border-gray-300 shadow-sm text-sm focus:border-red-500 focus:ring-red-500"
                >
                  <option value="">All Teams</option>
                  {teams.map((team) => (
                    <option key={team} value={team}>
                      {team}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {filteredUpcoming.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUpcoming.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-6">No matches match your filters.</p>
          )}
        </section>
      );
    }

    return (
      <section key={id} className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {matchList.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </section>
    );
  };

  if (loading) return <FixturesPageSkeleton />;
  if (error)
    return (
      <div className="container mx-auto px-6 py-8 text-center text-red-500">
        <p>{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* SEO */}
      <meta name="description" content="Live, upcoming, and recent cricket matches. Real-time scores, schedules, and results." />
      <meta name="keywords" content="cricket, live scores, fixtures, match schedule, ODI, T20, IPL, World Cup" />
      <meta name="robots" content="index, follow" />
      <title>Cricket Hub - Live & Upcoming Matches</title>

      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Cricket Fixtures</h1>
        <p className="text-gray-600 mb-10">Stay updated with real-time scores and upcoming games.</p>

        {renderSection('🔴 Live Matches', matches.live, 'live')}
        {renderSection('📅 Upcoming Matches', matches.upcoming, 'upcoming')}
        {renderSection('✅ Finished Matches', matches.finished, 'finished')}
      </div>
    </div>
  );
}

export default FixturesPage;